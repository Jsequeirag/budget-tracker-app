import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('sets credentials on login', () => {
    const user = { id: '1', email: 'test@example.com', name: 'Test' }
    useAuthStore.getState().setCredentials(user, 'token-123')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.token).toBe('token-123')
  })

  it('clears credentials on logout', () => {
    useAuthStore
      .getState()
      .setCredentials({ id: '1', email: 'test@example.com', name: 'Test' }, 'token')
    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
