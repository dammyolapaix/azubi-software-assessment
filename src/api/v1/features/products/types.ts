import products from './schema'

export type Product = typeof products.$inferSelect

export type InsertProduct = typeof products.$inferInsert
