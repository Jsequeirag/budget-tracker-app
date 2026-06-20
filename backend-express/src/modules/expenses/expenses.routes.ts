import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { validate } from '../../shared/middlewares/validate.js'
import { authenticate } from '../../shared/middlewares/auth.js'
import { ExpensesService } from './expenses.service.js'
import { ExpensesController } from './expenses.controller.js'
import { expenseIdParam, createExpenseSchema, updateExpenseSchema } from './expenses.schema.js'
import type { CategoriesRepository, ExpensesRepository } from '../../types/index.js'

export const createExpensesRouter = (
  expensesRepository: ExpensesRepository,
  categoriesRepository: CategoriesRepository,
) => {
  const router = Router()
  const service = new ExpensesService(expensesRepository, categoriesRepository)
  const controller = new ExpensesController(service)

  router.get('/', authenticate, asyncHandler(controller.getAll))
  router.get('/:id', authenticate, validate({ params: expenseIdParam }), asyncHandler(controller.getById))
  router.post('/', authenticate, validate({ body: createExpenseSchema }), asyncHandler(controller.create))
  router.put('/:id', authenticate, validate({ params: expenseIdParam, body: createExpenseSchema }), asyncHandler(controller.update))
  router.patch('/:id', authenticate, validate({ params: expenseIdParam, body: updateExpenseSchema }), asyncHandler(controller.update))
  router.delete('/:id', authenticate, validate({ params: expenseIdParam }), asyncHandler(controller.delete))

  return router
}
