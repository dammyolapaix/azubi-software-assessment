import { timestamp } from 'drizzle-orm/pg-core'

export const timestamps = {
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
  deletedAt: timestamp({ mode: 'string' }),
}
