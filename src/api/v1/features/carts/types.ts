import cartItems from './schema'

export type CartItem = typeof cartItems.$inferSelect

export type InsertCartItem = typeof cartItems.$inferInsert
