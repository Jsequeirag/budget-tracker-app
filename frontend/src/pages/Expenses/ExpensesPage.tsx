import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, TrendingDown, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight, Tag, Filter } from 'lucide-react'
import { useApiGet, useApiSend } from '@/api/config/customHooks'
import { expensesApi, type ExpenseDto } from '@/api/urls/expenses'
import { categoriesApi } from '@/api/urls/categories'
import { expenseSchema, type ExpenseFormInput } from '@/lib/schemas/expense.schema'
import { cn } from '@/lib/utils/cn'

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

export default function ExpensesPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [filterCategory, setFilterCategory] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseDto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: expensesRes, isPending } = useApiGet(
    ['expenses', month, year, filterCategory],
    () => expensesApi.getAll({ month, year, categoryId: filterCategory || undefined }),
  )
  const { data: categoriesRes } = useApiGet(['categories'], () => categoriesApi.getAll())

  const expenses = expensesRes?.data ?? []
  const categories = categoriesRes?.data ?? []
  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const { mutate: createExpense, isPending: creating } = useApiSend(
    (data: ExpenseFormInput) => expensesApi.create({ ...data, amount: Number(data.amount) }),
    [['expenses', month, year, filterCategory], ['reports']],
    {},
    () => { setIsModalOpen(false); reset() },
  )

  const { mutate: updateExpense, isPending: updating } = useApiSend(
    (data: ExpenseFormInput) => expensesApi.update({ id: editingExpense!.id, data: { ...data, amount: Number(data.amount) } }),
    [['expenses', month, year, filterCategory], ['reports']],
    {},
    () => { setIsModalOpen(false); setEditingExpense(null); reset() },
  )

  const { mutate: deleteExpense } = useApiSend(
    (id: string) => expensesApi.delete(id),
    [['expenses', month, year, filterCategory], ['reports']],
    {},
    () => setDeletingId(null),
  )

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  })

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const openCreate = () => {
    reset({ date: new Date().toISOString().split('T')[0], categoryId: categories[0]?.id ?? '' })
    setEditingExpense(null)
    setIsModalOpen(true)
  }

  const openEdit = (e: ExpenseDto) => {
    reset({
      amount: e.amount,
      description: e.description ?? '',
      date: new Date(e.date).toISOString().split('T')[0],
      categoryId: e.categoryId,
    })
    setEditingExpense(e)
    setIsModalOpen(true)
  }

  const onSubmit = (data: ExpenseFormInput) => {
    if (editingExpense) updateExpense(data)
    else createExpense(data)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
          <p className="text-gray-500 text-sm mt-0.5">Registra y controla tus gastos</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm w-fit">
          <Plus className="w-4 h-4" />
          Nuevo gasto
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        {/* Month selector */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
          <button onClick={prevMonth} className="p-0.5 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
          <span className="text-sm font-semibold text-gray-700 min-w-[120px] text-center">{MONTH_NAMES[month - 1]} {year}</span>
          <button onClick={nextMonth} className="p-0.5 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-0">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-sm text-gray-700 bg-transparent focus:outline-none w-full"
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Total */}
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 ml-auto">
          <TrendingDown className="w-4 h-4 text-rose-500" />
          <span className="text-sm font-bold text-rose-700">{fmt(total)}</span>
        </div>
      </div>

      {/* Table */}
      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <TrendingDown className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium">Sin gastos</p>
          <p className="text-sm mt-1">No hay gastos registrados para este período</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {expenses.map((expense) => {
              const cat = categories.find(c => c.id === expense.categoryId) ?? expense.category
              return (
                <div key={expense.id} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: (cat?.color ?? '#6366f1') + '20' }}>
                    <TrendingDown className="w-4 h-4" style={{ color: cat?.color ?? '#6366f1' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {expense.description ?? 'Sin descripción'}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {cat && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white" style={{ background: cat.color }}>
                          {cat.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-rose-600 text-sm flex-shrink-0">{fmt(expense.amount)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(expense)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    {deletingId === expense.id ? (
                      <>
                        <button onClick={() => deleteExpense(expense.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setDeletingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-4 h-4" /></button>
                      </>
                    ) : (
                      <button onClick={() => setDeletingId(expense.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editingExpense ? 'Editar gasto' : 'Nuevo gasto'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('amount', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                  <input
                    type="date"
                    {...register('date')}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                <select
                  {...register('categoryId')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent bg-white"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                  placeholder="Opcional"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={creating || updating} className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors">
                  {creating || updating ? 'Guardando...' : editingExpense ? 'Actualizar' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
