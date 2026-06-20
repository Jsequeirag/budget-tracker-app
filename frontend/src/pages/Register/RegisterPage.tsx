import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/api/urls/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormError } from '@/components/ui/FormError'
import { registerSchema, type RegisterFormData } from '@/lib/schemas/auth.schema'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'
import { getErrorMessage } from '@/lib/utils/error'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setCredentials } = useAuthStore()
  const { addToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      setCredentials(response.data.user, response.data.token)
      addToast('Cuenta creada exitosamente', 'success')
      navigate('/')
    } catch (error) {
      addToast(getErrorMessage(error), 'error')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-border shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Crear cuenta</h1>
        <p className="text-muted text-center mb-6">Regístrate para acceder al demo</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" type="text" autoComplete="name" {...register('name')} />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            <FormError message={errors.email?.message} />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            <FormError message={errors.password?.message} />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <FormError message={errors.confirmPassword?.message} />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
