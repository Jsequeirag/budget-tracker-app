import { request } from '../config/network'

export interface MonthlySummaryDto {
  month: number
  year: number
  totalIncome: number
  totalExpenses: number
  balance: number
}

export interface MonthlyReportDto {
  month: number
  year: number
  income: number
  expenses: number
  balance: number
}

export interface CategorySummaryDto {
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
}

export const reportsApi = {
  getSummary: (month: number, year: number) =>
    request<{ success: true; message: string; data: MonthlySummaryDto }>({
      url: '/reports/summary',
      method: 'GET',
      params: { month, year },
    }),

  getMonthly: (year: number) =>
    request<{ success: true; message: string; data: MonthlyReportDto[] }>({
      url: '/reports/monthly',
      method: 'GET',
      params: { year },
    }),

  getByCategory: (month: number, year: number) =>
    request<{ success: true; message: string; data: CategorySummaryDto[] }>({
      url: '/reports/by-category',
      method: 'GET',
      params: { month, year },
    }),
}
