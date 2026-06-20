import { z } from 'zod'

export const incomeSchema = z.object({
  amount: z
    .number({ required_error: 'El monto es obligatorio', invalid_type_error: 'Ingresa un número válido' })
    .positive('El monto debe ser mayor a 0'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
  source: z.string().max(100, 'Máximo 100 caracteres').optional(),
  date: z.string().min(1, 'La fecha es obligatoria'),
})

export type IncomeFormInput = z.infer<typeof incomeSchema>
