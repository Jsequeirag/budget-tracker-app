import { request } from '../config/network'
import type { CategoryDto } from './categories'

export interface ExpenseDto {
  id: string
  amount: number
  description: string | null
  date: string
  categoryId: string
  category?: CategoryDto
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateExpenseDto {
  amount: number
  description?: string
  date: string
  categoryId: string
}

export type UpdateExpenseDto = Partial<CreateExpenseDto>

export interface ExpenseFilters {
  month?: number
  year?: number
  categoryId?: string
}

export const expensesApi = {
  getAll: (filters?: ExpenseFilters) =>
    request<{ success: true; message: string; data: ExpenseDto[] }>({
      url: '/expenses',
      method: 'GET',
      params: filters,
    }),

  create: (data: CreateExpenseDto) =>
    request<{ success: true; message: string; data: ExpenseDto }>({ url: '/expenses', method: 'POST', data }),

  update: (params: { id: string; data: UpdateExpenseDto }) =>
    request<{ success: true; message: string; data: ExpenseDto }>({
      url: `/expenses/${params.id}`,
      method: 'PATCH',
      data: params.data,
    }),

  delete: (id: string) => request<void>({ url: `/expenses/${id}`, method: 'DELETE' }),
}
