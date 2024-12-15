import { and, eq } from 'drizzle-orm'
import db from '../../db'
import cartItems from './schema'
import { CartItem, InsertCartItem } from './types'

export default class CartServices {
  create = async (cartInfo: InsertCartItem) =>
    await db.insert(cartItems).values(cartInfo).returning()

  retrieve = async (query: Pick<InsertCartItem, 'productId' | 'userId'>) =>
    await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.productId, query.productId),
        eq(cartItems.userId, query.userId)
      ),
    })

  list = async (query: Partial<CartItem> & { userId: string }) =>
    await db.query.cartItems.findMany({
      where: and(
        eq(cartItems.userId, query.userId),
        query.productId ? eq(cartItems.productId, query.productId) : undefined
      ),
      with: {
        product: true,
      },
    })

  update = async (
    productId: string,
    userId: string,
    cartInfo: Pick<CartItem, 'quantity'>
  ) =>
    await db
      .update(cartItems)
      .set(cartInfo)
      .where(
        and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
      )
      .returning()

  delete = async (productId: string, userId: string) =>
    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.productId, productId), eq(cartItems.userId, userId))
      )
      .returning()
}
