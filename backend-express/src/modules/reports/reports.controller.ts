import type { Response } from 'express'
import type { AuthenticatedRequest } from '../../shared/middlewares/auth.js'
import { createResponse } from '../../shared/utils/response.js'
import { AppError } from '../../shared/errors/AppError.js'
import type { ReportsService } from './reports.service.js'

export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  getSummary = async (req: AuthenticatedRequest, res: Response) => {
    const { month, year } = req.query as Record<string, string>
    const now = new Date()
    const m = month ? Number(month) : now.getMonth() + 1
    const y = year ? Number(year) : now.getFullYear()
    if (m < 1 || m > 12) throw new AppError('Mes inválido', 400, 'VALIDATION_ERROR')
    const summary = await this.reportsService.getMonthlySummary(req.user!.id, m, y)
    res.json(createResponse(summary))
  }

  getMonthly = async (req: AuthenticatedRequest, res: Response) => {
    const { year } = req.query as Record<string, string>
    const y = year ? Number(year) : new Date().getFullYear()
    const report = await this.reportsService.getMonthlyReport(req.user!.id, y)
    res.json(createResponse(report))
  }

  getByCategory = async (req: AuthenticatedRequest, res: Response) => {
    const { month, year } = req.query as Record<string, string>
    const now = new Date()
    const m = month ? Number(month) : now.getMonth() + 1
    const y = year ? Number(year) : now.getFullYear()
    if (m < 1 || m > 12) throw new AppError('Mes inválido', 400, 'VALIDATION_ERROR')
    const data = await this.reportsService.getExpensesByCategory(req.user!.id, m, y)
    res.json(createResponse(data))
  }
}
