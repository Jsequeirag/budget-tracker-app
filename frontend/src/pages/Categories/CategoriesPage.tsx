import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus, Tag, Pencil, Trash2, X, Check, ShoppingCart, Utensils, Car, Home, Zap, Heart,
  GraduationCap, Gamepad2, MoreHorizontal, Briefcase, Coffee, Music, Plane, Baby, Dog,
  Wrench, BookOpen,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useApiGet, useApiSend } from '@/api/config/customHooks'
import { categoriesApi, type CategoryDto } from '@/api/urls/categories'
import { categorySchema, type CategoryFormInput } from '@/lib/schemas/category.schema'
import { cn } from '@/lib/utils/cn'

const AVAILABLE_ICONS = [
  { name: 'Tag', component: Tag },
  { name: 'ShoppingCart', component: ShoppingCart },
  { name: 'Utensils', component: Utensils },
  { name: 'Car', component: Car },
  { name: 'Home', component: Home },
  { name: 'Zap', component: Zap },
  { name: 'Heart', component: Heart },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Coffee', component: Coffee },
  { name: 'Music', component: Music },
  { name: 'Plane', component: Plane },
  { name: 'Baby', component: Baby },
  { name: 'Dog', component: Dog },
  { name: 'Wrench', component: Wrench },
  { name: 'BookOpen', component: BookOpen },
  { name: 'MoreHorizontal', component: MoreHorizontal },
]

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
  '#64748b', '#6b7280',
]

function CategoryIcon({ name, size = 18, color }: { name: string; size?: number; color?: string }) {
  const found = AVAILABLE_ICONS.find(i => i.name === name)
  if (!found) return <Tag size={size} color={color} />
  const Icon = found.component
  return <Icon size={size} color={color} />
}

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: res, isPending } = useApiGet(['categories'], () => categoriesApi.getAll())
  const categories = res?.data ?? []

  const { mutate: createCategory, isPending: creating } = useApiSend(
    (data: CategoryFormInput) => categoriesApi.create(data),
    [['categories']],
    {},
    () => { setIsModalOpen(false); reset() },
  )

  const { mutate: updateCategory, isPending: updating } = useApiSend(
    (data: CategoryFormInput) => categoriesApi.update({ id: editingCategory!.id, data }),
    [['categories']],
    {},
    () => { setIsModalOpen(false); setEditingCategory(null); reset() },
  )

  const { mutate: deleteCategory } = useApiSend(
    (id: string) => categoriesApi.delete(id),
    [['categories']],
    {},
    () => setDeletingId(null),
  )

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CategoryFormInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { color: '#6366f1', icon: 'Tag' },
  })
  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const openCreate = () => {
    reset({ color: '#6366f1', icon: 'Tag' })
    setEditingCategory(null)
    setIsModalOpen(true)
  }

  const openEdit = (cat: CategoryDto) => {
    reset({ name: cat.name, description: cat.description ?? '', color: cat.color, icon: cat.icon })
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  const onSubmit = (data: CategoryFormInput) => {
    if (editingCategory) updateCategory(data)
    else createCategory(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-500 text-sm mt-0.5">Organiza tus gastos por categoría</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Nueva categoría
        </button>
      </div>

      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Tag className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium">Sin categorías</p>
          <p className="text-sm mt-1">Crea tu primera categoría para organizar los gastos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 group hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.color + '20' }}>
                <CategoryIcon name={cat.icon} size={22} color={cat.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{cat.name}</p>
                {cat.description && <p className="text-xs text-gray-400 truncate mt-0.5">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                {deletingId === cat.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => deleteCategory(cat.id)} className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeletingId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setDeletingId(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedColor + '25' }}>
                  <CategoryIcon name={selectedIcon} size={20} color={selectedColor} />
                </div>
                <span className="font-medium text-gray-700">{watch('name') || 'Vista previa'}</span>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                  placeholder="Ej. Alimentación"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <input
                  {...register('description')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                  placeholder="Opcional"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color *</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={cn(
                        'w-7 h-7 rounded-full transition-transform hover:scale-110',
                        selectedColor === color && 'ring-2 ring-offset-2 ring-gray-400 scale-110',
                      )}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ícono *</label>
                <div className="grid grid-cols-9 gap-1">
                  {AVAILABLE_ICONS.map(({ name, component: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setValue('icon', name)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100',
                        selectedIcon === name ? 'ring-2 ring-indigo-400 bg-indigo-50' : '',
                      )}
                    >
                      <Icon size={16} className={selectedIcon === name ? 'text-indigo-600' : 'text-gray-500'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
                >
                  {creating || updating ? 'Guardando...' : editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
