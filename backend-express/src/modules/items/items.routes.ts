import { Router } from 'express'
import { asyncHandler } from '../../shared/middlewares/asyncHandler.js'
import { validate } from '../../shared/middlewares/validate.js'
import { authenticate } from '../../shared/middlewares/auth.js'
import { ItemsService } from './items.service.js'
import { ItemsController } from './items.controller.js'
import { itemIdParam, createItemSchema, patchItemSchema } from './items.schema.js'
import type { ItemsRepository } from '../../types/index.js'

export const createItemsRouter = (itemsRepository: ItemsRepository) => {
  const router = Router()

  const itemsService = new ItemsService(itemsRepository)
  const itemsController = new ItemsController(itemsService)

  router.get('/', asyncHandler(itemsController.getAll))
  router.get('/:id', validate({ params: itemIdParam }), asyncHandler(itemsController.getById))

  router.post('/', authenticate, validate({ body: createItemSchema }), asyncHandler(itemsController.create))
  router.put('/:id', authenticate, validate({ params: itemIdParam, body: createItemSchema }), asyncHandler(itemsController.update))
  router.patch('/:id', authenticate, validate({ params: itemIdParam, body: patchItemSchema }), asyncHandler(itemsController.patch))
  router.delete('/:id', authenticate, validate({ params: itemIdParam }), asyncHandler(itemsController.delete))

  return router
}
