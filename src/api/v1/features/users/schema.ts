import { pgEnum, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../../db/helper'
import { ROLES } from '../../utils/constants'

export const roleEnum = pgEnum('role', ROLES)

const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 320 }).notNull().unique(),
  password: varchar({ length: 256 }).notNull(),
  role: roleEnum().default('customer').notNull(),
  ...timestamps,
})

export default users
