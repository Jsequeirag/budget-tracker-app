import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../shared/middlewares/auth.js'
import { createResponse } from '../../shared/utils/response.js'
import type { CategoriesService } from './categories.service.js'

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  getAll = async (req: AuthenticatedRequest, res: Response) => {
    const categories = await this.categoriesService.getAll(req.user!.id)
    res.json(createResponse(categories))
  }

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const category = await this.categoriesService.getById(String(req.params.id), req.user!.id)
    res.json(createResponse(category))
  }

  create = async (req: AuthenticatedRequest, res: Response) => {
    const category = await this.categoriesService.create(req.body, req.user!.id)
    res.status(201).json(createResponse(category, 'Categoría creada'))
  }

  update = async (req: AuthenticatedRequest, res: Response) => {
    const category = await this.categoriesService.update(String(req.params.id), req.user!.id, req.body)
    res.json(createResponse(category, 'Categoría actualizada'))
  }

  delete = async (req: AuthenticatedRequest, res: Response) => {
    await this.categoriesService.delete(String(req.params.id), req.user!.id)
    res.status(204).send()
  }
}
