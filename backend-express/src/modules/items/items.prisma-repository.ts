import { prisma } from '../../config/database.js'
import type { CreateItemDto, Item, ItemsRepository, UpdateItemDto } from '../../types/index.js'

export class PrismaItemsRepository implements ItemsRepository {
  async findAll(): Promise<Item[]> {
    return prisma.item.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findById(id: string | number): Promise<Item | null> {
    return prisma.item.findUnique({ where: { id: String(id) } })
  }

  async create(data: CreateItemDto): Promise<Item> {
    return prisma.item.create({ data })
  }

  async update(id: string | number, data: UpdateItemDto): Promise<Item | null> {
    return prisma.item.update({ where: { id: String(id) }, data })
  }

  async delete(id: string | number): Promise<boolean> {
    await prisma.item.delete({ where: { id: String(id) } })
    return true
  }
}
