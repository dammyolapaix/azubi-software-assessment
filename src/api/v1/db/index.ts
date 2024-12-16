import { drizzle } from 'drizzle-orm/postgres-js'

import env from '../env'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: env.TESTING ? env.TEST_DATABASE_URL : env.DATABASE_URL,
    max: env.DB_MIGRATING || env.DB_SEEDING ? 1 : undefined,
    onnotice: env.DB_SEEDING ? () => {} : undefined,
  },
  casing: 'snake_case',
  logger: true,
  schema,
})

export default db
