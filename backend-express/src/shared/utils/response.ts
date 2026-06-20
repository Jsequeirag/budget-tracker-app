export const createResponse = <T>(data: T, message = 'Operación exitosa') => ({
  success: true as const,
  message,
  data,
})
