import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ItemsService } from '../../src/modules/items/items.service.js'
import { AppError } from '../../src/shared/errors/AppError.js'
import type { ItemsRepository } from '../../src/types/index.js'

describe('ItemsService', () => {
  const mockRepository: ItemsRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  }

  const service = new ItemsService(mockRepository)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('getAll returns all items', () => {
    vi.mocked(mockRepository.findAll).mockReturnValue([{ id: 1, name: 'A', description: null }])
    const result = service.getAll()
    expect(result).toEqual([{ id: 1, name: 'A', description: null }])
  })

  it('getById throws AppError when not found', () => {
    vi.mocked(mockRepository.findById).mockReturnValue(null)
    expect(() => service.getById(999)).toThrow('Recurso no encontrado')
  })

  it('create delegates to repository', () => {
    const item = { id: 1, name: 'A', description: null }
    vi.mocked(mockRepository.create).mockReturnValue(item)
    const result = service.create({ name: 'A' })
    expect(result).toEqual(item)
  })

  it('delete throws AppError when item does not exist', () => {
    vi.mocked(mockRepository.delete).mockReturnValue(false)
    expect(() => service.delete(999)).toThrow('Recurso no encontrado')
  })
})
