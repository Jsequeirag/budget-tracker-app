import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '@/api/urls/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { FormError } from '@/components/ui/FormError'
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schema'
import { useAuthStore } from '@/store/useAuthStore'
import { useToastStore } from '@/store/useToastStore'
import { getErrorMessage } from '@/lib/utils/error'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setCredentials } = useAuthStore()
  const { addToast } = useToastStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data)
      setCredentials(response.data.user, response.data.token)
      addToast('Bienvenido de vuelta', 'success')
      navigate('/')
    } catch (error) {
      addToast(getErrorMessage(error), 'error')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-surface border border-border shadow-md">
        <h1 className="text-2xl font-bold text-center mb-2">Iniciar sesión</h1>
        <p className="text-muted text-center mb-6">Ingresa tus credenciales para continuar</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              autoComplete="current-password"
              {...register('password')}
            />
            <FormError message={errors.password?.message} />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
