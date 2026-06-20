import { AppError } from '../../shared/errors/AppError.js'
import type { CategoriesRepository, CreateExpenseDto, ExpensesRepository, UpdateExpenseDto } from '../../types/index.js'

export class ExpensesService {
  constructor(
    private readonly expensesRepository: ExpensesRepository,
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  getAll(userId: string, filters?: { month?: number; year?: number; categoryId?: string }) {
    return this.expensesRepository.findAll(userId, filters)
  }

  async getById(id: string, userId: string) {
    const expense = await this.expensesRepository.findById(id, userId)
    if (!expense) throw new AppError('Gasto no encontrado', 404, 'NOT_FOUND')
    return expense
  }

  async create(data: CreateExpenseDto, userId: string) {
    const category = await this.categoriesRepository.findById(data.categoryId, userId)
    if (!category) throw new AppError('Categoría no encontrada o no pertenece al usuario', 404, 'NOT_FOUND')
    return this.expensesRepository.create({ ...data, userId })
  }

  async update(id: string, userId: string, data: UpdateExpenseDto) {
    if (data.categoryId) {
      const category = await this.categoriesRepository.findById(data.categoryId, userId)
      if (!category) throw new AppError('Categoría no encontrada o no pertenece al usuario', 404, 'NOT_FOUND')
    }
    const expense = await this.expensesRepository.update(id, userId, data)
    if (!expense) throw new AppError('Gasto no encontrado', 404, 'NOT_FOUND')
    return expense
  }

  async delete(id: string, userId: string) {
    const deleted = await this.expensesRepository.delete(id, userId)
    if (!deleted) throw new AppError('Gasto no encontrado', 404, 'NOT_FOUND')
  }

  getMonthlySummary(userId: string, year: number) {
    return this.expensesRepository.findMonthlySummary(userId, year)
  }

  getByCategory(userId: string, month: number, year: number) {
    return this.expensesRepository.findByCategory(userId, month, year)
  }
}
