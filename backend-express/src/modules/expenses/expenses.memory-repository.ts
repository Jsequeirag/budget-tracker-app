import type { CategorySummary, CreateExpenseDto, Expense, ExpensesRepository, MonthlySummaryItem, UpdateExpenseDto } from '../../types/index.js'

export class MemoryExpensesRepository implements ExpensesRepository {
  private expenses: Expense[] = []
  private nextId = 1

  findAll(userId: string, filters?: { month?: number; year?: number; categoryId?: string }): Expense[] {
    let result = this.expenses.filter((e) => e.userId === userId)
    if (filters?.month) result = result.filter((e) => new Date(e.date).getMonth() + 1 === filters.month)
    if (filters?.year) result = result.filter((e) => new Date(e.date).getFullYear() === filters.year)
    if (filters?.categoryId) result = result.filter((e) => e.categoryId === filters.categoryId)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  findById(id: string, userId: string): Expense | null {
    return this.expenses.find((e) => e.id === id && e.userId === userId) ?? null
  }

  create(data: CreateExpenseDto & { userId: string }): Expense {
    const expense: Expense = {
      id: String(this.nextId++),
      amount: data.amount,
      description: data.description ?? null,
      date: new Date(data.date),
      categoryId: data.categoryId,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.expenses.push(expense)
    return expense
  }

  update(id: string, userId: string, data: UpdateExpenseDto): Expense | null {
    const index = this.expenses.findIndex((e) => e.id === id && e.userId === userId)
    if (index === -1) return null
    this.expenses[index] = {
      ...this.expenses[index],
      ...data,
      date: data.date ? new Date(data.date) : this.expenses[index].date,
      updatedAt: new Date(),
    }
    return this.expenses[index]
  }

  delete(id: string, userId: string): boolean {
    const index = this.expenses.findIndex((e) => e.id === id && e.userId === userId)
    if (index === -1) return false
    this.expenses.splice(index, 1)
    return true
  }

  findMonthlySummary(userId: string, year: number): MonthlySummaryItem[] {
    const byMonth: Record<number, number> = {}
    this.expenses
      .filter((e) => e.userId === userId && new Date(e.date).getFullYear() === year)
      .forEach((e) => {
        const month = new Date(e.date).getMonth() + 1
        byMonth[month] = (byMonth[month] ?? 0) + e.amount
      })
    return Object.entries(byMonth).map(([month, total]) => ({ month: Number(month), year, total }))
  }

  findByCategory(userId: string, month: number, year: number): CategorySummary[] {
    const byCat: Record<string, number> = {}
    this.expenses
      .filter(
        (e) =>
          e.userId === userId &&
          new Date(e.date).getMonth() + 1 === month &&
          new Date(e.date).getFullYear() === year,
      )
      .forEach((e) => {
        byCat[e.categoryId] = (byCat[e.categoryId] ?? 0) + e.amount
      })
    return Object.entries(byCat).map(([categoryId, total]) => ({
      categoryId,
      categoryName: categoryId,
      categoryColor: '#6366f1',
      categoryIcon: 'Tag',
      total,
    }))
  }

  reset(): void {
    this.expenses = []
    this.nextId = 1
  }
}
