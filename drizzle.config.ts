import type { Config } from 'drizzle-kit'
import env from './src/api/v1/env'

export default {
  schema: './src/api/v1/db/schema.ts',
  out: './src/api/v1/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
} satisfies Config
