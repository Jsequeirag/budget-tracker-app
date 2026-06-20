import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { validate } from '../../shared/middlewares/validate.js'
import { authenticate } from '../../shared/middlewares/auth.js'
import { CategoriesService } from './categories.service.js'
import { CategoriesController } from './categories.controller.js'
import { categoryIdParam, createCategorySchema, updateCategorySchema } from './categories.schema.js'
import type { CategoriesRepository } from '../../types/index.js'

export const createCategoriesRouter = (categoriesRepository: CategoriesRepository) => {
  const router = Router()
  const service = new CategoriesService(categoriesRepository)
  const controller = new CategoriesController(service)

  router.get('/', authenticate, asyncHandler(controller.getAll))
  router.get('/:id', authenticate, validate({ params: categoryIdParam }), asyncHandler(controller.getById))
  router.post('/', authenticate, validate({ body: createCategorySchema }), asyncHandler(controller.create))
  router.put('/:id', authenticate, validate({ params: categoryIdParam, body: createCategorySchema }), asyncHandler(controller.update))
  router.patch('/:id', authenticate, validate({ params: categoryIdParam, body: updateCategorySchema }), asyncHandler(controller.update))
  router.delete('/:id', authenticate, validate({ params: categoryIdParam }), asyncHandler(controller.delete))

  return router
}
