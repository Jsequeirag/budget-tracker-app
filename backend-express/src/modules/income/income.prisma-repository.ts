import { prisma } from '../../config/database.js'
import type { CreateIncomeDto, Income, IncomesRepository, MonthlySummaryItem, UpdateIncomeDto } from '../../types/index.js'

export class PrismaIncomesRepository implements IncomesRepository {
  async findAll(userId: string, filters?: { month?: number; year?: number }): Promise<Income[]> {
    const where: Record<string, unknown> = { userId }
    if (filters?.month || filters?.year) {
      const year = filters.year ?? new Date().getFullYear()
      const month = filters.month ?? new Date().getMonth() + 1
      where.date = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      }
    }
    return prisma.income.findMany({ where, orderBy: { date: 'desc' } })
  }

  async findById(id: string, userId: string): Promise<Income | null> {
    return prisma.income.findFirst({ where: { id, userId } })
  }

  async create(data: CreateIncomeDto & { userId: string }): Promise<Income> {
    return prisma.income.create({ data: { ...data, date: new Date(data.date) } })
  }

  async update(id: string, userId: string, data: UpdateIncomeDto): Promise<Income | null> {
    const existing = await prisma.income.findFirst({ where: { id, userId } })
    if (!existing) return null
    return prisma.income.update({
      where: { id },
      data: { ...data, date: data.date ? new Date(data.date) : undefined },
    })
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.income.findFirst({ where: { id, userId } })
    if (!existing) return false
    await prisma.income.delete({ where: { id } })
    return true
  }

  async findMonthlySummary(userId: string, year: number): Promise<MonthlySummaryItem[]> {
    const incomes = await prisma.income.findMany({
      where: { userId, date: { gte: new Date(year, 0, 1), lt: new Date(year + 1, 0, 1) } },
      select: { date: true, amount: true },
    })
    const byMonth: Record<number, number> = {}
    incomes.forEach((i: { date: Date; amount: number }) => {
      const month = i.date.getMonth() + 1
      byMonth[month] = (byMonth[month] ?? 0) + i.amount
    })
    return Object.entries(byMonth).map(([month, total]) => ({ month: Number(month), year, total }))
  }
}
