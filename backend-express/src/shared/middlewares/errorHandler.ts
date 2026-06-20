import type { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/AppError.js'
import { logger } from '../../config/logger.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    })
    return
  }

  if (err.name === 'ValidationError' || err.statusCode === 400) {
    res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: err.message,
    })
    return
  }

  logger.error(err, 'Error inesperado')

  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
  })
}
