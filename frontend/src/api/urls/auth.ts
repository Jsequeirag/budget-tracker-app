import { request } from '../config/network'

export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export const authApi = {
  login: (data: LoginCredentials) =>
    request<{ success: true; message: string; data: AuthResponse }>({ url: '/auth/login', method: 'POST', data }),

  register: (data: RegisterCredentials) =>
    request<{ success: true; message: string; data: AuthResponse }>({ url: '/auth/register', method: 'POST', data }),

  me: () => request<{ success: true; message: string; data: User }>({ url: '/auth/me', method: 'GET' }),
}
