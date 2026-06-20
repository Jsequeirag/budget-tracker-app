import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/AppError.js'
import { env } from '../../config/env.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Token no proporcionado', 401, 'UNAUTHORIZED'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string }
    req.user = { id: decoded.id, email: decoded.email }
    next()
  } catch (_error) {
    next(new AppError('Token inválido o expirado', 401, 'UNAUTHORIZED'))
  }
}
