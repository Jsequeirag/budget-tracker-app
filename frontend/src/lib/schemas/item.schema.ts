import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

export type ItemFormData = z.infer<typeof itemSchema>
