export interface Item {
  id: string | number
  name: string
  description: string | null
  createdAt?: Date
  updatedAt?: Date
}

export type CreateItemDto = {
  name: string
  description?: string
}

export type UpdateItemDto = Partial<CreateItemDto>

export interface User {
  id: string
  email: string
  name: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface UserWithPassword extends User {
  password: string
}

export type CreateUserDto = {
  email: string
  password: string
  name?: string
}

export interface ItemsRepository {
  findAll(): Item[] | Promise<Item[]>
  findById(id: string | number): Item | null | Promise<Item | null>
  create(data: CreateItemDto): Item | Promise<Item>
  update(id: string | number, data: UpdateItemDto): Item | null | Promise<Item | null>
  delete(id: string | number): boolean | Promise<boolean>
  reset?(): void
}

export interface UsersRepository {
  findByEmail(email: string): UserWithPassword | null | Promise<UserWithPassword | null>
  findById(id: string): User | null | Promise<User | null>
  create(data: CreateUserDto): UserWithPassword | Promise<UserWithPassword>
  reset?(): void
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateCategoryDto = {
  name: string
  description?: string
  color: string
  icon: string
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>

export interface CategoriesRepository {
  findAll(userId: string): Category[] | Promise<Category[]>
  findById(id: string, userId: string): Category | null | Promise<Category | null>
  create(data: CreateCategoryDto & { userId: string }): Category | Promise<Category>
  update(id: string, userId: string, data: UpdateCategoryDto): Category | null | Promise<Category | null>
  delete(id: string, userId: string): boolean | Promise<boolean>
  reset?(): void
}

// ─── Expense ──────────────────────────────────────────────────────────────────

export interface Expense {
  id: string
  amount: number
  description: string | null
  date: Date
  categoryId: string
  category?: Category
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateExpenseDto = {
  amount: number
  description?: string
  date: string | Date
  categoryId: string
}

export type UpdateExpenseDto = Partial<CreateExpenseDto>

export interface ExpensesRepository {
  findAll(userId: string, filters?: { month?: number; year?: number; categoryId?: string }): Expense[] | Promise<Expense[]>
  findById(id: string, userId: string): Expense | null | Promise<Expense | null>
  create(data: CreateExpenseDto & { userId: string }): Expense | Promise<Expense>
  update(id: string, userId: string, data: UpdateExpenseDto): Expense | null | Promise<Expense | null>
  delete(id: string, userId: string): boolean | Promise<boolean>
  findMonthlySummary(userId: string, year: number): MonthlySummaryItem[] | Promise<MonthlySummaryItem[]>
  findByCategory(userId: string, month: number, year: number): CategorySummary[] | Promise<CategorySummary[]>
  reset?(): void
}

// ─── Income ───────────────────────────────────────────────────────────────────

export interface Income {
  id: string
  amount: number
  description: string | null
  source: string | null
  date: Date
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export type CreateIncomeDto = {
  amount: number
  description?: string
  source?: string
  date: string | Date
}

export type UpdateIncomeDto = Partial<CreateIncomeDto>

export interface IncomesRepository {
  findAll(userId: string, filters?: { month?: number; year?: number }): Income[] | Promise<Income[]>
  findById(id: string, userId: string): Income | null | Promise<Income | null>
  create(data: CreateIncomeDto & { userId: string }): Income | Promise<Income>
  update(id: string, userId: string, data: UpdateIncomeDto): Income | null | Promise<Income | null>
  delete(id: string, userId: string): boolean | Promise<boolean>
  findMonthlySummary(userId: string, year: number): MonthlySummaryItem[] | Promise<MonthlySummaryItem[]>
  reset?(): void
}

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface MonthlySummaryItem {
  month: number
  year: number
  total: number
}

export interface CategorySummary {
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  total: number
}

export interface MonthlyReport {
  month: number
  year: number
  income: number
  expenses: number
  balance: number
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  success: true
  message: string
  data: T
}

export interface ApiErrorResponse {
  success: false
  code: string
  message: string
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
