import { describe, it, expect } from 'vitest'
import { getErrorMessage, isApiError } from './error'

describe('error utils', () => {
  it('extracts message from ApiError', () => {
    const error = { success: false as const, code: 'TEST', message: 'Custom error' }
    expect(getErrorMessage(error)).toBe('Custom error')
    expect(isApiError(error)).toBe(true)
  })

  it('extracts message from Error instance', () => {
    expect(getErrorMessage(new Error('Plain error'))).toBe('Plain error')
  })

  it('returns fallback for unknown errors', () => {
    expect(getErrorMessage(null)).toBe('Ocurrió un error inesperado.')
    expect(getErrorMessage(undefined)).toBe('Ocurrió un error inesperado.')
    expect(getErrorMessage(42)).toBe('Ocurrió un error inesperado.')
  })
})
