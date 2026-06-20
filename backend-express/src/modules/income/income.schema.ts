import { z } from 'zod'

export const incomeIdParam = z.object({
  id: z.string().min(1, 'El id es obligatorio'),
})

export const createIncomeSchema = z.object({
  amount: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
  source: z.string().max(100, 'Máximo 100 caracteres').optional(),
  date: z.coerce.date({ required_error: 'La fecha es obligatoria' }),
})

export const updateIncomeSchema = createIncomeSchema.partial()

export type CreateIncomeInput = z.infer<typeof createIncomeSchema>
export type UpdateIncomeInput = z.infer<typeof updateIncomeSchema>
