// Barrel de DTOs. Re-exporta los tipos de entrada/salida de cada módulo de API.
// Los componentes deben importar DTOs desde aquí, no desde los archivos de urls directamente.
export type { CreateItemDto, Item, UpdateItemDto } from '../urls/items'
export type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../urls/auth'
