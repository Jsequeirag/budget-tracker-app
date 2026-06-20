import { AppError } from '../../shared/errors/AppError.js'
import type { CreateItemDto, Item, ItemsRepository, UpdateItemDto } from '../../types/index.js'

export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  getAll(): Item[] | Promise<Item[]> {
    return this.itemsRepository.findAll()
  }

  getById(id: string | number): Item | Promise<Item> {
    const item = this.itemsRepository.findById(id)
    if (item instanceof Promise) {
      return item.then((resolved) => {
        if (!resolved) throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
        return resolved
      })
    }
    if (!item) {
      throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
    }
    return item
  }

  create(data: CreateItemDto): Item | Promise<Item> {
    return this.itemsRepository.create(data)
  }

  update(id: string | number, data: CreateItemDto): Item | Promise<Item> {
    const item = this.itemsRepository.update(id, data)
    return this.resolveItem(item)
  }

  patch(id: string | number, data: UpdateItemDto): Item | Promise<Item> {
    const item = this.itemsRepository.update(id, data)
    return this.resolveItem(item)
  }

  delete(id: string | number): void | Promise<void> {
    const deleted = this.itemsRepository.delete(id)
    if (deleted instanceof Promise) {
      return deleted.then((resolved) => {
        if (!resolved) throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
      })
    }
    if (!deleted) {
      throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
    }
  }

  private resolveItem(item: Item | null | Promise<Item | null>): Item | Promise<Item> {
    if (item instanceof Promise) {
      return item.then((resolved) => {
        if (!resolved) throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
        return resolved
      })
    }
    if (!item) {
      throw new AppError('Recurso no encontrado', 404, 'NOT_FOUND')
    }
    return item
  }
}
