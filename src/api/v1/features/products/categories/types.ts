import categories from './schema'

export type Category = typeof categories.$inferSelect

export type InsertCategory = typeof categories.$inferInsert
