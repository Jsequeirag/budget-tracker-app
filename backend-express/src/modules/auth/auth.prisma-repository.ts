import { prisma } from '../../config/database.js'
import type { CreateUserDto, User, UserWithPassword, UsersRepository } from '../../types/index.js'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async create(data: CreateUserDto): Promise<UserWithPassword> {
    return prisma.user.create({ data })
  }
}
