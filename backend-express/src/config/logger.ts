import pino from 'pino'
import { env } from './env.js'

const isDevelopment = env.NODE_ENV === 'development'
const isTest = env.NODE_ENV === 'test'

export const logger = pino({
  level: isTest ? 'silent' : env.LOG_LEVEL,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
})
