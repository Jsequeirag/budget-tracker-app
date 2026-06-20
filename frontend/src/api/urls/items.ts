import { request } from '../config/network'

export interface Item {
  id: string | number
  name: string
  description: string | null
  createdAt?: string
  updatedAt?: string
}

export type CreateItemDto = {
  name: string
  description?: string
}

export type UpdateItemDto = Partial<CreateItemDto>

export const itemsApi = {
  getAll: () => request<Item[]>({ url: '/items', method: 'GET' }),

  getById: (id: string | number) => request<Item>({ url: `/items/${id}`, method: 'GET' }),

  create: (data: CreateItemDto) => request<Item>({ url: '/items', method: 'POST', data }),

  update: (params: { id: string | number; data: CreateItemDto }) =>
    request<Item>({ url: `/items/${params.id}`, method: 'PUT', data: params.data }),

  patch: (params: { id: string | number; data: UpdateItemDto }) =>
    request<Item>({ url: `/items/${params.id}`, method: 'PATCH', data: params.data }),

  delete: (id: string | number) => request<void>({ url: `/items/${id}`, method: 'DELETE' }),
}
