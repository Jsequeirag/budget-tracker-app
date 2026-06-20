import type { CreateUserDto, UserWithPassword, UsersRepository } from '../../types/index.js'

export class MemoryUsersRepository implements UsersRepository {
  private users: UserWithPassword[] = []
  private nextId = 1

  findByEmail(email: string): UserWithPassword | null {
    return this.users.find((user) => user.email === email) ?? null
  }

  findById(id: string): UserWithPassword | null {
    return this.users.find((user) => user.id === id) ?? null
  }

  create(data: CreateUserDto): UserWithPassword {
    const newUser: UserWithPassword = {
      id: String(this.nextId++),
      email: data.email,
      password: data.password,
      name: data.name ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }

  reset(): void {
    this.users = []
    this.nextId = 1
  }
}
