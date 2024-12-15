import { relations } from 'drizzle-orm'
import { integer, pgTable, uuid } from 'drizzle-orm/pg-core'
import { timestamps } from '../../db/helper'
import products from '../products/schema'
import users from '../users/schema'

const cartItems = pgTable('cart_items', {
  quantity: integer().default(1),
  productId: uuid()
    .notNull()
    .references(() => products.id),
  userId: uuid()
    .notNull()
    .references(() => users.id),
  ...timestamps,
})

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
}))

export default cartItems
