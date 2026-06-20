import type { ExpensesRepository, IncomesRepository, MonthlyReport } from '../../types/index.js'

export class ReportsService {
  constructor(
    private readonly expensesRepository: ExpensesRepository,
    private readonly incomesRepository: IncomesRepository,
  ) {}

  async getMonthlySummary(userId: string, month: number, year: number) {
    const [expenseSummary, incomeSummary] = await Promise.all([
      this.expensesRepository.findMonthlySummary(userId, year),
      this.incomesRepository.findMonthlySummary(userId, year),
    ])
    const totalExpenses = expenseSummary.find((e) => e.month === month)?.total ?? 0
    const totalIncome = incomeSummary.find((i) => i.month === month)?.total ?? 0
    return {
      month,
      year,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    }
  }

  async getMonthlyReport(userId: string, year: number): Promise<MonthlyReport[]> {
    const [expenseSummary, incomeSummary] = await Promise.all([
      this.expensesRepository.findMonthlySummary(userId, year),
      this.incomesRepository.findMonthlySummary(userId, year),
    ])
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    return months.map((month) => {
      const income = incomeSummary.find((i) => i.month === month)?.total ?? 0
      const expenses = expenseSummary.find((e) => e.month === month)?.total ?? 0
      return { month, year, income, expenses, balance: income - expenses }
    })
  }

  getExpensesByCategory(userId: string, month: number, year: number) {
    return this.expensesRepository.findByCategory(userId, month, year)
  }
}
