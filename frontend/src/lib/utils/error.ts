export interface ApiError {
  success: false
  code: string
  message: string
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    error.success === false &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ocurrió un error inesperado.'
}
