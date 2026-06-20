import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../../shared/errors/AppError.js'
import { env } from '../../config/env.js'
import type { LoginInput, RegisterInput } from './auth.schema.js'
import type { User, UserWithPassword, UsersRepository } from '../../types/index.js'

export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(data: RegisterInput): Promise<{ user: User; token: string }> {
    const existing = await this.usersRepository.findByEmail(data.email)
    if (existing) {
      throw new AppError('El correo ya está registrado', 409, 'EMAIL_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(data.password, env.BCRYPT_ROUNDS)
    const user = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
    })

    const token = this.generateToken(user)
    return { user: this.sanitizeUser(user), token }
  }

  async login(data: LoginInput): Promise<{ user: User; token: string }> {
    const user = await this.usersRepository.findByEmail(data.email)
    if (!user) {
      throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS')
    }

    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS')
    }

    const token = this.generateToken(user)
    return { user: this.sanitizeUser(user), token }
  }

  private generateToken(user: UserWithPassword): string {
    return jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
  }

  private sanitizeUser(user: UserWithPassword): User {
    const { password: _password, ...rest } = user
    return rest
  }
}
