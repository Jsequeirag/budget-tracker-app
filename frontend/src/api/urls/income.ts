import { request } from '../config/network'

export interface IncomeDto {
  id: string
  amount: number
  description: string | null
  source: string | null
  date: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateIncomeDto {
  amount: number
  description?: string
  source?: string
  date: string
}

export type UpdateIncomeDto = Partial<CreateIncomeDto>

export interface IncomeFilters {
  month?: number
  year?: number
}

export const incomeApi = {
  getAll: (filters?: IncomeFilters) =>
    request<{ success: true; message: string; data: IncomeDto[] }>({
      url: '/income',
      method: 'GET',
      params: filters,
    }),

  create: (data: CreateIncomeDto) =>
    request<{ success: true; message: string; data: IncomeDto }>({ url: '/income', method: 'POST', data }),

  update: (params: { id: string; data: UpdateIncomeDto }) =>
    request<{ success: true; message: string; data: IncomeDto }>({
      url: `/income/${params.id}`,
      method: 'PATCH',
      data: params.data,
    }),

  delete: (id: string) => request<void>({ url: `/income/${id}`, method: 'DELETE' }),
}
