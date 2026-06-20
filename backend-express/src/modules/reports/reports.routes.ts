import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { authenticate } from '../../shared/middlewares/auth.js'
import { ReportsService } from './reports.service.js'
import { ReportsController } from './reports.controller.js'
import type { ExpensesRepository, IncomesRepository } from '../../types/index.js'

export const createReportsRouter = (
  expensesRepository: ExpensesRepository,
  incomesRepository: IncomesRepository,
) => {
  const router = Router()
  const service = new ReportsService(expensesRepository, incomesRepository)
  const controller = new ReportsController(service)

  router.get('/summary', authenticate, asyncHandler(controller.getSummary))
  router.get('/monthly', authenticate, asyncHandler(controller.getMonthly))
  router.get('/by-category', authenticate, asyncHandler(controller.getByCategory))

  return router
}
