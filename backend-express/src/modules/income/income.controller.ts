import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../shared/middlewares/auth.js'
import { createResponse } from '../../shared/utils/response.js'
import type { IncomeService } from './income.service.js'

export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  getAll = async (req: AuthenticatedRequest, res: Response) => {
    const { month, year } = req.query as Record<string, string>
    const filters = {
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined,
    }
    const incomes = await this.incomeService.getAll(req.user!.id, filters)
    res.json(createResponse(incomes))
  }

  getById = async (req: AuthenticatedRequest, res: Response) => {
    const income = await this.incomeService.getById(String(req.params.id), req.user!.id)
    res.json(createResponse(income))
  }

  create = async (req: AuthenticatedRequest, res: Response) => {
    const income = await this.incomeService.create(req.body, req.user!.id)
    res.status(201).json(createResponse(income, 'Ingreso registrado'))
  }

  update = async (req: AuthenticatedRequest, res: Response) => {
    const income = await this.incomeService.update(String(req.params.id), req.user!.id, req.body)
    res.json(createResponse(income, 'Ingreso actualizado'))
  }

  delete = async (req: AuthenticatedRequest, res: Response) => {
    await this.incomeService.delete(String(req.params.id), req.user!.id)
    res.status(204).send()
  }
}
