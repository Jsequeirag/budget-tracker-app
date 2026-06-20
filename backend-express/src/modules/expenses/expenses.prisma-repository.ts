import { prisma } from '../../config/database.js'
import type { CategorySummary, CreateExpenseDto, Expense, ExpensesRepository, MonthlySummaryItem, UpdateExpenseDto } from '../../types/index.js'

export class PrismaExpensesRepository implements ExpensesRepository {
  async findAll(userId: string, filters?: { month?: number; year?: number; categoryId?: string }): Promise<Expense[]> {
    const where: Record<string, unknown> = { userId }
    if (filters?.categoryId) where.categoryId = filters.categoryId
    if (filters?.month || filters?.year) {
      const year = filters.year ?? new Date().getFullYear()
      const month = filters.month ?? new Date().getMonth() + 1
      where.date = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      }
    }
    return prisma.expense.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
    }) as Promise<Expense[]>
  }

  async findById(id: string, userId: string): Promise<Expense | null> {
    return prisma.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    }) as Promise<Expense | null>
  }

  async create(data: CreateExpenseDto & { userId: string }): Promise<Expense> {
    return prisma.expense.create({
      data: { ...data, date: new Date(data.date) },
      include: { category: true },
    }) as Promise<Expense>
  }

  async update(id: string, userId: string, data: UpdateExpenseDto): Promise<Expense | null> {
    const existing = await prisma.expense.findFirst({ where: { id, userId } })
    if (!existing) return null
    return prisma.expense.update({
      where: { id },
      data: { ...data, date: data.date ? new Date(data.date) : undefined },
      include: { category: true },
    }) as Promise<Expense>
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.expense.findFirst({ where: { id, userId } })
    if (!existing) return false
    await prisma.expense.delete({ where: { id } })
    return true
  }

  async findMonthlySummary(userId: string, year: number): Promise<MonthlySummaryItem[]> {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) },
      },
      select: { date: true, amount: true },
    })
    const byMonth: Record<number, number> = {}
    expenses.forEach((e: { date: Date; amount: number }) => {
      const month = e.date.getMonth() + 1
      byMonth[month] = (byMonth[month] ?? 0) + e.amount
    })
    return Object.entries(byMonth).map(([month, total]) => ({ month: Number(month), year, total }))
  }

  async findByCategory(userId: string, month: number, year: number): Promise<CategorySummary[]> {
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: new Date(year, month - 1, 1), lt: new Date(year, month, 1) },
      },
      include: { category: true },
    })
    const byCat: Record<string, { name: string; color: string; icon: string; total: number }> = {}
    expenses.forEach((e: { categoryId: string; amount: number; category: { name: string; color: string; icon: string } }) => {
      if (!byCat[e.categoryId]) {
        byCat[e.categoryId] = { name: e.category.name, color: e.category.color, icon: e.category.icon, total: 0 }
      }
      byCat[e.categoryId].total += e.amount
    })
    return Object.entries(byCat).map(([categoryId, v]) => ({
      categoryId,
      categoryName: v.name,
      categoryColor: v.color,
      categoryIcon: v.icon,
      total: v.total,
    }))
  }
}
