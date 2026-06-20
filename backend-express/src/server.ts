import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'

export const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor Express corriendo en http://localhost:${env.PORT}`)
})
