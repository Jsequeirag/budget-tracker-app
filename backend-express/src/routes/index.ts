import { Router } from 'express'
import { createItemsRouter } from '../modules/items/items.routes.js'
import { createAuthRouter } from '../modules/auth/auth.routes.js'
import { createCategoriesRouter } from '../modules/categories/categories.routes.js'
import { createExpensesRouter } from '../modules/expenses/expenses.routes.js'
import { createIncomeRouter } from '../modules/income/income.routes.js'
import { createReportsRouter } from '../modules/reports/reports.routes.js'
import type { CategoriesRepository, ExpensesRepository, IncomesRepository, ItemsRepository, UsersRepository } from '../types/index.js'

export interface ApiRouterOptions {
  itemsRepository: ItemsRepository
  usersRepository: UsersRepository
  categoriesRepository: CategoriesRepository
  expensesRepository: ExpensesRepository
  incomesRepository: IncomesRepository
}

export const createApiRouter = (options: ApiRouterOptions) => {
  const { itemsRepository, usersRepository, categoriesRepository, expensesRepository, incomesRepository } = options
  const router = Router()

  router.get('/', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }))

  router.use('/auth', createAuthRouter(usersRepository))
  router.use('/items', createItemsRouter(itemsRepository))
  router.use('/categories', createCategoriesRouter(categoriesRepository))
  router.use('/expenses', createExpensesRouter(expensesRepository, categoriesRepository))
  router.use('/income', createIncomeRouter(incomesRepository))
  router.use('/reports', createReportsRouter(expensesRepository, incomesRepository))

  return router
}

export default createApiRouter
