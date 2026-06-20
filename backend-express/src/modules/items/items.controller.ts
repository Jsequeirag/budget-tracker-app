import type { Request, Response } from 'express'
import { createResponse } from '../../shared/utils/response.js'
import type { ItemsService } from './items.service.js'

export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  getAll = async (_req: Request, res: Response) => {
    const items = await this.itemsService.getAll()
    res.json(createResponse(items))
  }

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const item = await this.itemsService.getById(id)
    res.json(createResponse(item))
  }

  create = async (req: Request, res: Response) => {
    const item = await this.itemsService.create(req.body)
    res.status(201).json(createResponse(item, 'Recurso creado'))
  }

  update = async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const item = await this.itemsService.update(id, req.body)
    res.json(createResponse(item, 'Recurso actualizado'))
  }

  patch = async (req: Request, res: Response) => {
    const id = String(req.params.id)
    const item = await this.itemsService.patch(id, req.body)
    res.json(createResponse(item, 'Recurso actualizado'))
  }

  delete = async (req: Request, res: Response) => {
    const id = String(req.params.id)
    await this.itemsService.delete(id)
    res.status(204).send()
  }
}
