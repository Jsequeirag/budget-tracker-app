import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  description: z.string().max(200, 'Máximo 200 caracteres').optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hexadecimal inválido').default('#6366f1'),
  icon: z.string().min(1, 'Selecciona un ícono').default('Tag'),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
