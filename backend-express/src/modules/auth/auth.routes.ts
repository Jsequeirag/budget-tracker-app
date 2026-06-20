import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { validate } from '../../shared/middlewares/validate.js'
import { authenticate, type AuthenticatedRequest } from '../../shared/middlewares/auth.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { registerSchema, loginSchema } from './auth.schema.js'
import type { UsersRepository } from '../../types/index.js'

export const createAuthRouter = (usersRepository: UsersRepository) => {
  const router = Router()

  const authService = new AuthService(usersRepository)
  const authController = new AuthController(authService)

  router.post('/register', validate({ body: registerSchema }), asyncHandler(authController.register))
  router.post('/login', validate({ body: loginSchema }), asyncHandler(authController.login))
  router.get('/me', authenticate, asyncHandler(authController.me as (req: AuthenticatedRequest, res: import('express').Response) => Promise<unknown>))

  return router
}
