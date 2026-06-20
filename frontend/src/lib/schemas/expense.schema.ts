import { z } from 'zod'

export const expenseSchema = z.object({
  amount: z
    .number({ required_error: 'El monto es obligatorio', invalid_type_error: 'Ingresa un número válido' })
    .positive('El monto debe ser mayor a 0'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
  date: z.string().min(1, 'La fecha es obligatoria'),
  categoryId: z.string().min(1, 'Selecciona una categoría'),
})

export type ExpenseFormInput = z.infer<typeof expenseSchema>
