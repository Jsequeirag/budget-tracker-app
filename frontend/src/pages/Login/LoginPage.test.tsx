import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import * as authApi from '@/api/urls/auth'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/api/urls/auth', async () => {
  const actual = await vi.importActual<typeof import('@/api/urls/auth')>('@/api/urls/auth')
  return {
    ...actual,
    authApi: {
      login: vi.fn(),
    },
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
    vi.resetAllMocks()
  })

  it('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByText(/correo no es válido/i)).toBeInTheDocument()
    })
  })

  it('calls login API with valid data', async () => {
    const user = userEvent.setup()
    const loginMock = vi.mocked(authApi.authApi.login).mockResolvedValue({
      user: { id: '1', email: 'test@example.com', name: 'Test', createdAt: '', updatedAt: '' },
      token: 'token',
    })

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await user.type(screen.getByLabelText(/contraseña/i), '123456')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ email: 'test@example.com', password: '123456' })
    })
  })
})
