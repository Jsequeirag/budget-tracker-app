import { AppError } from '../../shared/errors/AppError.js'
import type { CreateIncomeDto, IncomesRepository, UpdateIncomeDto } from '../../types/index.js'

export class IncomeService {
  constructor(private readonly incomesRepository: IncomesRepository) {}

  getAll(userId: string, filters?: { month?: number; year?: number }) {
    return this.incomesRepository.findAll(userId, filters)
  }

  async getById(id: string, userId: string) {
    const income = await this.incomesRepository.findById(id, userId)
    if (!income) throw new AppError('Ingreso no encontrado', 404, 'NOT_FOUND')
    return income
  }

  create(data: CreateIncomeDto, userId: string) {
    return this.incomesRepository.create({ ...data, userId })
  }

  async update(id: string, userId: string, data: UpdateIncomeDto) {
    const income = await this.incomesRepository.update(id, userId, data)
    if (!income) throw new AppError('Ingreso no encontrado', 404, 'NOT_FOUND')
    return income
  }

  async delete(id: string, userId: string) {
    const deleted = await this.incomesRepository.delete(id, userId)
    if (!deleted) throw new AppError('Ingreso no encontrado', 404, 'NOT_FOUND')
  }

  getMonthlySummary(userId: string, year: number) {
    return this.incomesRepository.findMonthlySummary(userId, year)
  }
}
