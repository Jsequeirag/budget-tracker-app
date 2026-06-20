import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('El correo no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(1).optional(),
})

export const loginSchema = z.object({
  email: z.string().email('El correo no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
