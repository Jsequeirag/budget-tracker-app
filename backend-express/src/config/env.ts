import 'dotenv/config'
import { cleanEnv, port, str, num } from 'envalid'

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 3000 }),
  CORS_ORIGIN: str({ default: '*' }),
  LOG_LEVEL: str({ choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'], default: 'info' }),

  JWT_SECRET: str({ default: 'cambia_este_secreto_en_produccion' }),
  JWT_EXPIRES_IN: str({ default: '1d' }),
  BCRYPT_ROUNDS: num({ default: 10 }),

  DATABASE_URL: str({ default: '' }),

  RATE_LIMIT_WINDOW_MS: num({ default: 15 * 60 * 1000 }),
  RATE_LIMIT_MAX: num({ default: 100 }),
})
