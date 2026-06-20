import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip,
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ChevronLeft, ChevronRight, Calendar,
} from 'lucide-react'
import { useApiGet } from '@/api/config/customHooks'
import { reportsApi } from '@/api/urls/reports'
import { expensesApi } from '@/api/urls/expenses'
import { incomeApi } from '@/api/urls/income'
import { cn } from '@/lib/utils/cn'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const FULL_MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(n)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{FULL_MONTH_NAMES[(label ?? 1) - 1]}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

const PieCustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-600">{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function DashboardPage() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const { data: summaryRes, isPending: loadingSummary } = useApiGet(
    ['reports', 'summary', month, year],
    () => reportsApi.getSummary(month, year),
  )
  const { data: monthlyRes, isPending: loadingMonthly } = useApiGet(
    ['reports', 'monthly', year],
    () => reportsApi.getMonthly(year),
  )
  const { data: categoryRes, isPending: loadingCategory } = useApiGet(
    ['reports', 'by-category', month, year],
    () => reportsApi.getByCategory(month, year),
  )
  const { data: recentExpensesRes } = useApiGet(
    ['expenses', 'recent', month, year],
    () => expensesApi.getAll({ month, year }),
  )
  const { data: recentIncomeRes } = useApiGet(
    ['income', 'recent', month, year],
    () => incomeApi.getAll({ month, year }),
  )

  const summary = summaryRes?.data
  const monthlyData = (monthlyRes?.data ?? []).map(d => ({
    ...d, name: MONTH_NAMES[d.month - 1],
  }))
  const categoryData = categoryRes?.data ?? []

  const recentExpenses = (recentExpensesRes?.data ?? []).slice(0, 5)
  const recentIncome = (recentIncomeRes?.data ?? []).slice(0, 5)
  const recentAll = [
    ...recentExpenses.map(e => ({ ...e, type: 'expense' as const })),
    ...recentIncome.map(i => ({ ...i, type: 'income' as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)

  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Resumen financiero</p>
        </div>
        {/* Month selector */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
          <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-1.5 min-w-[130px] justify-center">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="font-semibold text-gray-800 text-sm">
              {FULL_MONTH_NAMES[month - 1]} {year}
            </span>
          </div>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Ingresos del mes"
          value={summary?.totalIncome ?? 0}
          loading={loadingSummary}
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <SummaryCard
          label="Gastos del mes"
          value={summary?.totalExpenses ?? 0}
          loading={loadingSummary}
          icon={<TrendingDown className="w-5 h-5" />}
          color="red"
        />
        <SummaryCard
          label="Balance"
          value={summary?.balance ?? 0}
          loading={loadingSummary}
          icon={<DollarSign className="w-5 h-5" />}
          color={(summary?.balance ?? 0) >= 0 ? 'green' : 'red'}
          highlight
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Ingresos vs Gastos — {year}</h2>
          {loadingMonthly ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={10} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₡${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Gastos por categoría</h2>
          {loadingCategory ? (
            <div className="h-56 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
            </div>
          ) : categoryData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-gray-400">
              <TrendingDown className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">Sin gastos este mes</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} dataKey="total" nameKey="categoryName" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <PieTooltip content={<PieCustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5 max-h-28 overflow-y-auto">
                {categoryData.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.categoryColor }} />
                      <span className="text-gray-600 truncate">{c.categoryName}</span>
                    </div>
                    <span className="font-medium text-gray-800 ml-2 flex-shrink-0">{fmt(c.total)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Transacciones recientes — {FULL_MONTH_NAMES[month - 1]}</h2>
        {recentAll.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Sin movimientos este mes</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentAll.map((tx) => (
              <div key={`${tx.type}-${tx.id}`} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                    tx.type === 'income' ? 'bg-emerald-50' : 'bg-rose-50',
                  )}>
                    {tx.type === 'income'
                      ? <TrendingUp className="w-4 h-4 text-emerald-500" />
                      : <TrendingDown className="w-4 h-4 text-rose-500" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {tx.description ?? (tx.type === 'income' ? 'Ingreso' : 'Gasto')}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                      {tx.type === 'expense' && (tx as any).category && (
                        <span
                          className="ml-2 px-1.5 py-0.5 rounded-full text-white text-[10px] font-medium"
                          style={{ background: (tx as any).category.color }}
                        >
                          {(tx as any).category.name}
                        </span>
                      )}
                      {tx.type === 'income' && (tx as any).source && (
                        <span className="ml-2 text-gray-400">· {(tx as any).source}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  'font-semibold text-sm flex-shrink-0 ml-4',
                  tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600',
                )}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface SummaryCardProps {
  label: string
  value: number
  loading?: boolean
  icon: React.ReactNode
  color: 'green' | 'red' | 'indigo'
  highlight?: boolean
}

function SummaryCard({ label, value, loading, icon, color, highlight }: SummaryCardProps) {
  const colors = {
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-500', value: 'text-emerald-700', border: 'border-emerald-100' },
    red: { bg: 'bg-rose-50', icon: 'text-rose-500', value: 'text-rose-700', border: 'border-rose-100' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500', value: 'text-indigo-700', border: 'border-indigo-100' },
  }
  const c = colors[color]

  return (
    <div className={cn(
      'bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4',
      highlight ? 'border-gray-200 ring-2 ring-offset-1 ring-indigo-100' : 'border-gray-100',
    )}>
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0', c.bg)}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        {loading ? (
          <div className="h-7 w-28 bg-gray-100 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className={cn('text-xl font-bold mt-0.5', c.value)}>
            {new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(value)}
          </p>
        )}
      </div>
    </div>
  )
}
