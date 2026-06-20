import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { validate } from '../../shared/middlewares/validate.js'
import { authenticate } from '../../shared/middlewares/auth.js'
import { IncomeService } from './income.service.js'
import { IncomeController } from './income.controller.js'
import { incomeIdParam, createIncomeSchema, updateIncomeSchema } from './income.schema.js'
import type { IncomesRepository } from '../../types/index.js'

export const createIncomeRouter = (incomesRepository: IncomesRepository) => {
  const router = Router()
  const service = new IncomeService(incomesRepository)
  const controller = new IncomeController(service)

  router.get('/', authenticate, asyncHandler(controller.getAll))
  router.get('/:id', authenticate, validate({ params: incomeIdParam }), asyncHandler(controller.getById))
  router.post('/', authenticate, validate({ body: createIncomeSchema }), asyncHandler(controller.create))
  router.put('/:id', authenticate, validate({ params: incomeIdParam, body: createIncomeSchema }), asyncHandler(controller.update))
  router.patch('/:id', authenticate, validate({ params: incomeIdParam, body: updateIncomeSchema }), asyncHandler(controller.update))
  router.delete('/:id', authenticate, validate({ params: incomeIdParam }), asyncHandler(controller.delete))

  return router
}
