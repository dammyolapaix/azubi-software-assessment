import users from './schema'

export type User = typeof users.$inferSelect

export type InsertUser = typeof users.$inferInsert

export type SessionUser = {
  id: string
}

export type SingleUserQuery =
  | { id: User['id']; email?: never }
  | { email: User['email']; id?: never }

export type RetrieveUser = SingleUserQuery & {
  password?: true
}
