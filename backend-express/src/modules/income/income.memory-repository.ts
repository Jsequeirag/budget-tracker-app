import type { CreateIncomeDto, Income, IncomesRepository, MonthlySummaryItem, UpdateIncomeDto } from '../../types/index.js'

export class MemoryIncomesRepository implements IncomesRepository {
  private incomes: Income[] = []
  private nextId = 1

  findAll(userId: string, filters?: { month?: number; year?: number }): Income[] {
    let result = this.incomes.filter((i) => i.userId === userId)
    if (filters?.month) result = result.filter((i) => new Date(i.date).getMonth() + 1 === filters.month)
    if (filters?.year) result = result.filter((i) => new Date(i.date).getFullYear() === filters.year)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  findById(id: string, userId: string): Income | null {
    return this.incomes.find((i) => i.id === id && i.userId === userId) ?? null
  }

  create(data: CreateIncomeDto & { userId: string }): Income {
    const income: Income = {
      id: String(this.nextId++),
      amount: data.amount,
      description: data.description ?? null,
      source: data.source ?? null,
      date: new Date(data.date),
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.incomes.push(income)
    return income
  }

  update(id: string, userId: string, data: UpdateIncomeDto): Income | null {
    const index = this.incomes.findIndex((i) => i.id === id && i.userId === userId)
    if (index === -1) return null
    this.incomes[index] = {
      ...this.incomes[index],
      ...data,
      date: data.date ? new Date(data.date) : this.incomes[index].date,
      updatedAt: new Date(),
    }
    return this.incomes[index]
  }

  delete(id: string, userId: string): boolean {
    const index = this.incomes.findIndex((i) => i.id === id && i.userId === userId)
    if (index === -1) return false
    this.incomes.splice(index, 1)
    return true
  }

  findMonthlySummary(userId: string, year: number): MonthlySummaryItem[] {
    const byMonth: Record<number, number> = {}
    this.incomes
      .filter((i) => i.userId === userId && new Date(i.date).getFullYear() === year)
      .forEach((i) => {
        const month = new Date(i.date).getMonth() + 1
        byMonth[month] = (byMonth[month] ?? 0) + i.amount
      })
    return Object.entries(byMonth).map(([month, total]) => ({ month: Number(month), year, total }))
  }

  reset(): void {
    this.incomes = []
    this.nextId = 1
  }
}
