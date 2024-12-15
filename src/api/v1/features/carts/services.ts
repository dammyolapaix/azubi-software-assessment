import { eq } from 'drizzle-orm'
import db from '../../db'
import cartItems from './schema'
import { CartItem, InsertCartItem } from './types'

export default class CartServices {
  create = async (cartInfo: InsertCartItem) =>
    await db.insert(cartItems).values(cartInfo).returning()

  retrieve = async (query: Pick<InsertCartItem, 'productId'>) =>
    await db.query.cartItems.findFirst({
      where: eq(cartItems.productId, query.productId),
    })

  list = async (query: Pick<CartItem, 'productId'>) =>
    await db.query.cartItems.findMany({
      where: eq(cartItems.productId, query.productId),
    })

  update = async (productId: string, cartInfo: Pick<CartItem, 'quantity'>) =>
    await db
      .update(cartItems)
      .set(cartInfo)
      .where(eq(cartItems.productId, productId))
      .returning()

  delete = async (productId: string) =>
    await db
      .delete(cartItems)
      .where(eq(cartItems.productId, productId))
      .returning()
}
