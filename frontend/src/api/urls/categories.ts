import { request } from '../config/network'

export interface CategoryDto {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  userId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCategoryDto {
  name: string
  description?: string
  color: string
  icon: string
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>

export const categoriesApi = {
  getAll: () => request<{ success: true; message: string; data: CategoryDto[] }>({ url: '/categories', method: 'GET' }),

  create: (data: CreateCategoryDto) =>
    request<{ success: true; message: string; data: CategoryDto }>({ url: '/categories', method: 'POST', data }),

  update: (params: { id: string; data: UpdateCategoryDto }) =>
    request<{ success: true; message: string; data: CategoryDto }>({
      url: `/categories/${params.id}`,
      method: 'PATCH',
      data: params.data,
    }),

  delete: (id: string) => request<void>({ url: `/categories/${id}`, method: 'DELETE' }),
}
