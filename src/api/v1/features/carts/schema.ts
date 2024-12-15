import { relations } from 'drizzle-orm'
import { integer, pgTable, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../db/helper'
import products from '../products/schema'

const cartItems = pgTable('cart_items', {
  quantity: integer().default(1),
  productId: uuid()
    .notNull()
    .references(() => products.id),
  ...timestamps,
})

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}))

export default cartItems
