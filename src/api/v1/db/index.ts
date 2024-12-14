import { drizzle } from 'drizzle-orm/postgres-js'

import * as schema from './schema'
import env from '../env'

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
    onnotice: env.DB_SEEDING ? () => {} : undefined,
  },
  casing: 'snake_case',
  logger: true,
  schema,
})

export default db
