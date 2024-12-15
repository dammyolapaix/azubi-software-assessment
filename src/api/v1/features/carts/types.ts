import { Request } from 'express'
import cartItems from './schema'

export type CartItem = typeof cartItems.$inferSelect

export type InsertCartItem = typeof cartItems.$inferInsert

export type RetrieveCartItemRequestType = Request<
  { productId?: string },
  {},
  { productId?: string },
  {}
> & {
  cartItem?: CartItem
}
