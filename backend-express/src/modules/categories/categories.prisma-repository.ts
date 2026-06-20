import { prisma } from '../../config/database.js'
import type { Category, CategoriesRepository, CreateCategoryDto, UpdateCategoryDto } from '../../types/index.js'

export class PrismaCategoriesRepository implements CategoriesRepository {
  async findAll(userId: string): Promise<Category[]> {
    return prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    return prisma.category.findFirst({ where: { id, userId } })
  }

  async create(data: CreateCategoryDto & { userId: string }): Promise<Category> {
    return prisma.category.create({ data })
  }

  async update(id: string, userId: string, data: UpdateCategoryDto): Promise<Category | null> {
    const existing = await prisma.category.findFirst({ where: { id, userId } })
    if (!existing) return null
    return prisma.category.update({ where: { id }, data })
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const existing = await prisma.category.findFirst({ where: { id, userId } })
    if (!existing) return false
    await prisma.category.delete({ where: { id } })
    return true
  }
}
