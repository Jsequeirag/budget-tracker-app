import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../shared/middlewares/auth.js'
import { createResponse } from '../../shared/utils/response.js'
import type { ExpensesService } from './expenses.service.js'

export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  getAll = async (req: AuthenticatedRequest, res: Response) => {
    const { month, year, categoryId } = req.query as Record<string, string>
    const filters = {
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
      categoryId: categoryId || undefined,
    }
    const expenses = await this.expensesService.getAll(req.user!.id, filters)
    res.json(createResponse(expenses))
  }

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const expense = await this.expensesService.getById(String(req.params.id), req.user!.id)
    res.json(createResponse(expense))
  }

  create = async (req: AuthenticatedRequest, res: Response) => {
    const expense = await this.expensesService.create(req.body, req.user!.id)
    res.status(201).json(createResponse(expense, 'Gasto registrado'))
  }

  update = async (req: AuthenticatedRequest, res: Response) => {
    const expense = await this.expensesService.update(String(req.params.id), req.user!.id, req.body)
    res.json(createResponse(expense, 'Gasto actualizado'))
  }

  delete = async (req: AuthenticatedRequest, res: Response) => {
    await this.expensesService.delete(String(req.params.id), req.user!.id)
    res.status(204).send()
  }
}
