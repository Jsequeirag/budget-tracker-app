import { z } from 'zod'

export const categoryIdParam = z.object({
  id: z.string().min(1, 'El id es obligatorio'),
})

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido (ej. #6366f1)')
    .default('#6366f1'),
  icon: z.string().min(1, 'El ícono es obligatorio').default('Tag'),
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
