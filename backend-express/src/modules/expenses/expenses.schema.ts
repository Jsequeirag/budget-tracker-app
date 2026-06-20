import { z } from 'zod'

export const expenseIdParam = z.object({
  id: z.string().min(1, 'El id es obligatorio'),
})

export const createExpenseSchema = z.object({
  amount: z.number({ required_error: 'El monto es obligatorio' }).positive('El monto debe ser mayor a 0'),
  description: z.string().max(300, 'Máximo 300 caracteres').optional(),
  date: z.coerce.date({ required_error: 'La fecha es obligatoria' }),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
})

export const updateExpenseSchema = createExpenseSchema.partial()

export const expenseFiltersQuery = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  categoryId: z.string().optional(),
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type ExpenseFilters = z.infer<typeof expenseFiltersQuery>
