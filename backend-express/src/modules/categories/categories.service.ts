import { AppError } from '../../shared/errors/AppError.js'
import type { CategoriesRepository, CreateCategoryDto, UpdateCategoryDto } from '../../types/index.js'

export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  getAll(userId: string) {
    return this.categoriesRepository.findAll(userId)
  }

  async getById(id: string, userId: string) {
    const category = await this.categoriesRepository.findById(id, userId)
    if (!category) throw new AppError('Categoría no encontrada', 404, 'NOT_FOUND')
    return category
  }

  create(data: CreateCategoryDto, userId: string) {
    return this.categoriesRepository.create({ ...data, userId })
  }

  async update(id: string, userId: string, data: UpdateCategoryDto) {
    const category = await this.categoriesRepository.update(id, userId, data)
    if (!category) throw new AppError('Categoría no encontrada', 404, 'NOT_FOUND')
    return category
  }

  async delete(id: string, userId: string) {
    const deleted = await this.categoriesRepository.delete(id, userId)
    if (!deleted) throw new AppError('Categoría no encontrada', 404, 'NOT_FOUND')
  }
}
