import type { Request, Response, NextFunction } from 'express'
import type { ZodSchema, ZodEffects } from 'zod'
import { AppError } from '../errors/AppError.js'

type ValidationSchemas = {
  body?: ZodSchema | ZodEffects<ZodSchema, unknown, unknown>
  params?: ZodSchema | ZodEffects<ZodSchema, unknown, unknown>
  query?: ZodSchema | ZodEffects<ZodSchema, unknown, unknown>
}

export const validate = (schemas: ValidationSchemas) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const targets = { body: req.body, params: req.params, query: req.query }

      for (const [key, schema] of Object.entries(schemas)) {
        if (!schema) continue
        const result = schema.safeParse(targets[key as keyof ValidationSchemas])

        if (!result.success) {
          throw new AppError(`Validación fallida en ${key}`, 400, 'VALIDATION_ERROR')
        }

        const targetKey = key as keyof Request
        ;(req as unknown as Record<keyof Request, unknown>)[targetKey] = result.data
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}
