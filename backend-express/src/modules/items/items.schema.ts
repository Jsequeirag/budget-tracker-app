import { z } from 'zod'

export const itemIdParam = z.object({
  id: z.coerce.string().min(1, 'El id es obligatorio'),
})

export const createItemSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export const updateItemSchema = createItemSchema

export const patchItemSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
})

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof patchItemSchema>
