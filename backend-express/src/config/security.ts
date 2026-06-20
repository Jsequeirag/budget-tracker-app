import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import type { RequestHandler } from 'express'
import { env } from './env.js'

export const securityMiddlewares: RequestHandler[] = [
  helmet(),
  compression(),
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      code: 'TOO_MANY_REQUESTS',
      message: 'Demasiadas solicitudes, intenta más tarde',
    },
  }),
]
