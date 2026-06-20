import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { corsOptions } from './config/cors.js'
import { securityMiddlewares } from './config/security.js'
import { requestLogger } from './shared/middlewares/requestLogger.js'
import { errorHandler } from './shared/middlewares/errorHandler.js'
import { createApiRouter } from './routes/index.js'
import {
  createItemsRepository,
  createUsersRepository,
  createCategoriesRepository,
  createExpensesRepository,
  createIncomesRepository,
} from './config/repositories.js'
import type { CategoriesRepository, ExpensesRepository, IncomesRepository, ItemsRepository, UsersRepository } from './types/index.js'

export interface CreateAppOptions {
  itemsRepository?: ItemsRepository
  usersRepository?: UsersRepository
  categoriesRepository?: CategoriesRepository
  expensesRepository?: ExpensesRepository
  incomesRepository?: IncomesRepository
}

export const createApp = (options: CreateAppOptions = {}) => {
  const itemsRepository = options.itemsRepository ?? createItemsRepository()
  const usersRepository = options.usersRepository ?? createUsersRepository()
  const categoriesRepository = options.categoriesRepository ?? createCategoriesRepository()
  const expensesRepository = options.expensesRepository ?? createExpensesRepository()
  const incomesRepository = options.incomesRepository ?? createIncomesRepository()

  const app = express()

  app.use(securityMiddlewares)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors(corsOptions))

  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger)
  }

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.use(
    '/api',
    createApiRouter({ itemsRepository, usersRepository, categoriesRepository, expensesRepository, incomesRepository }),
  )

  app.use((_req, res, _next) => {
    res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Ruta no encontrada' })
  })

  app.use(errorHandler)

  return app
}

export const app = createApp()
