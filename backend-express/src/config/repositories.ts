import { env } from './env.js'
import { MemoryItemsRepository } from '../modules/items/items.memory-repository.js'
import { PrismaItemsRepository } from '../modules/items/items.prisma-repository.js'
import { MemoryUsersRepository } from '../modules/auth/auth.memory-repository.js'
import { PrismaUsersRepository } from '../modules/auth/auth.prisma-repository.js'
import { MemoryCategoriesRepository } from '../modules/categories/categories.memory-repository.js'
import { PrismaCategoriesRepository } from '../modules/categories/categories.prisma-repository.js'
import { MemoryExpensesRepository } from '../modules/expenses/expenses.memory-repository.js'
import { PrismaExpensesRepository } from '../modules/expenses/expenses.prisma-repository.js'
import { MemoryIncomesRepository } from '../modules/income/income.memory-repository.js'
import { PrismaIncomesRepository } from '../modules/income/income.prisma-repository.js'
import type { CategoriesRepository, ExpensesRepository, IncomesRepository, ItemsRepository, UsersRepository } from '../types/index.js'

const hasDatabase = Boolean(env.DATABASE_URL)

export const createItemsRepository = (): ItemsRepository =>
  hasDatabase ? new PrismaItemsRepository() : new MemoryItemsRepository()

export const createUsersRepository = (): UsersRepository =>
  hasDatabase ? new PrismaUsersRepository() : new MemoryUsersRepository()

export const createCategoriesRepository = (): CategoriesRepository =>
  hasDatabase ? new PrismaCategoriesRepository() : new MemoryCategoriesRepository()

export const createExpensesRepository = (): ExpensesRepository =>
  hasDatabase ? new PrismaExpensesRepository() : new MemoryExpensesRepository()

export const createIncomesRepository = (): IncomesRepository =>
  hasDatabase ? new PrismaIncomesRepository() : new MemoryIncomesRepository()

export { hasDatabase }
