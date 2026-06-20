import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { AuthService } from '../../src/modules/auth/auth.service.js'
import type { UsersRepository } from '../../src/types/index.js'

describe('AuthService', () => {
  const mockRepository: UsersRepository = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  }

  const authService = new AuthService(mockRepository)

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('registers a new user and returns token', async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null)
    vi.mocked(mockRepository.create).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashed',
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await authService.register({
      email: 'test@example.com',
      password: '123456',
      name: 'Test',
    })

    expect(result.user.email).toBe('test@example.com')
    expect(result.user.password).toBeUndefined()
    expect(result.token).toBeDefined()
  })

  it('throws when email already exists', async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: 'hashed',
      name: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await expect(
      authService.register({ email: 'test@example.com', password: '123456' }),
    ).rejects.toThrow('El correo ya está registrado')
  })

  it('logs in with valid credentials', async () => {
    const hashed = await bcrypt.hash('123456', 10)
    vi.mocked(mockRepository.findByEmail).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      password: hashed,
      name: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await authService.login({ email: 'test@example.com', password: '123456' })

    expect(result.user.email).toBe('test@example.com')
    expect(result.token).toBeDefined()
  })

  it('throws with invalid credentials', async () => {
    vi.mocked(mockRepository.findByEmail).mockResolvedValue(null)

    await expect(
      authService.login({ email: 'test@example.com', password: '123456' }),
    ).rejects.toThrow('Credenciales inválidas')
  })
})
