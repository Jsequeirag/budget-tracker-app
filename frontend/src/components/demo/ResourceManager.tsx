import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useApiGet, useApiSend } from '@/api/config/customHooks'
import { itemsApi, type Item, type CreateItemDto } from '@/api/urls/items'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormError } from '@/components/ui/FormError'
import { itemSchema } from '@/lib/schemas/item.schema'

function ResourceManager() {
  const {
    data: resources,
    isPending,
    isError,
  } = useApiGet<Item[], Error>(['items'], itemsApi.getAll)

  const { mutate: createResource, isPending: isCreating } = useApiSend<Item, Error, CreateItemDto>(
    itemsApi.create,
    [['items']],
  )

  const { mutate: updateResource } = useApiSend<
    Item,
    Error,
    { id: string | number; data: CreateItemDto }
  >(itemsApi.patch, [['items']])

  const { mutate: deleteResource } = useApiSend<void, Error, string | number>(itemsApi.delete, [
    ['items'],
  ])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemDto>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const onSubmit = (data: CreateItemDto) => {
    createResource(data, {
      onSuccess: () => reset(),
    })
  }

  if (isPending) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Cargando recursos"
        className="p-4 rounded-md bg-surface border border-border"
      >
        Cargando recursos...
      </div>
    )
  }

  if (isError) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800"
      >
        <strong className="block mb-1">No se pudo conectar con el servidor.</strong>
        <span className="text-sm">
          Verifica que el backend esté en ejecución en{' '}
          <code className="font-mono bg-red-100 px-1 rounded">
            {import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}
          </code>
          .
        </span>
      </div>
    )
  }

  return (
    <section
      aria-label="Demo de API — recursos"
      className="grid gap-4 p-6 border border-border rounded-lg bg-surface shadow-sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <div>
          <Label htmlFor="name">Nombre del recurso</Label>
          <Input id="name" {...register('name')} />
          <FormError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Input id="description" {...register('description')} />
          <FormError message={errors.description?.message} />
        </div>

        <Button type="submit" isLoading={isCreating} className="justify-self-start">
          {isCreating ? 'Creando...' : 'Crear recurso'}
        </Button>
      </form>

      <ul
        aria-live="polite"
        aria-label="Lista de recursos"
        className="grid gap-3 list-none p-0 m-0"
      >
        {resources?.map((resource) => (
          <li
            key={resource.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-md bg-surface-soft"
          >
            <div>
              <h4 className="m-0 font-semibold">{resource.name}</h4>
              <p className="m-0 text-muted">{resource.description}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                type="button"
                aria-label={`Editar "${resource.name}"`}
                variant="secondary"
                onClick={() =>
                  updateResource({
                    id: resource.id,
                    data: { name: `${resource.name} (actualizado)` },
                  })
                }
                className="flex-1 sm:flex-none"
              >
                Editar
              </Button>
              <Button
                type="button"
                aria-label={`Eliminar "${resource.name}"`}
                variant="danger"
                onClick={() => deleteResource(resource.id)}
                className="flex-1 sm:flex-none"
              >
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ResourceManager
