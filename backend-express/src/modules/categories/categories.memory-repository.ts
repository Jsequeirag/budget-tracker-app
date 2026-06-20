import type { Category, CategoriesRepository, CreateCategoryDto, UpdateCategoryDto } from '../../types/index.js'

export class MemoryCategoriesRepository implements CategoriesRepository {
  private categories: Category[] = []
  private nextId = 1

  findAll(userId: string): Category[] {
    return this.categories.filter((c) => c.userId === userId)
  }

  findById(id: string, userId: string): Category | null {
    return this.categories.find((c) => c.id === id && c.userId === userId) ?? null
  }

  create(data: CreateCategoryDto & { userId: string }): Category {
    const category: Category = {
      id: String(this.nextId++),
      name: data.name,
      description: data.description ?? null,
      color: data.color,
      icon: data.icon,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.categories.push(category)
    return category
  }

  update(id: string, userId: string, data: UpdateCategoryDto): Category | null {
    const index = this.categories.findIndex((c) => c.id === id && c.userId === userId)
    if (index === -1) return null
    this.categories[index] = { ...this.categories[index], ...data, updatedAt: new Date() }
    return this.categories[index]
  }

  delete(id: string, userId: string): boolean {
    const index = this.categories.findIndex((c) => c.id === id && c.userId === userId)
    if (index === -1) return false
    this.categories.splice(index, 1)
    return true
  }

  reset(): void {
    this.categories = []
    this.nextId = 1
  }
}
