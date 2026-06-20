import type { CreateItemDto, Item, ItemsRepository, UpdateItemDto } from '../../types/index.js'

export class MemoryItemsRepository implements ItemsRepository {
  private items: Item[]
  private nextId: number

  constructor(initialItems: Item[] = []) {
    this.items = [...initialItems]
    this.nextId = initialItems.length > 0 ? Math.max(...initialItems.map((item) => Number(item.id))) + 1 : 1
  }

  findAll(): Item[] {
    return [...this.items]
  }

  findById(id: string | number): Item | null {
    const numericId = Number(id)
    return this.items.find((item) => item.id === numericId) ?? null
  }

  create(data: CreateItemDto): Item {
    const newItem: Item = {
      id: this.nextId++,
      name: data.name,
      description: data.description ?? '',
    }
    this.items.push(newItem)
    return newItem
  }

  update(id: string | number, data: UpdateItemDto): Item | null {
    const numericId = Number(id)
    const index = this.items.findIndex((item) => item.id === numericId)
    if (index === -1) return null

    this.items[index] = { ...this.items[index], ...data }
    return this.items[index]
  }

  delete(id: string | number): boolean {
    const numericId = Number(id)
    const index = this.items.findIndex((item) => item.id === numericId)
    if (index === -1) return false

    this.items.splice(index, 1)
    return true
  }

  reset(): void {
    this.items = []
    this.nextId = 1
  }
}
