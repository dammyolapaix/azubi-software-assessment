import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../../db/helper'
import categories from './categories/schema'
import images from './images/schema'

const products = pgTable('products', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 255 }).unique().notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  price: integer().default(0),
  categoryId: uuid()
    .notNull()
    .references(() => categories.id),
  imageId: uuid().references(() => images.id),
  isPublished: boolean().default(false),
  ...timestamps,
})

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  image: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}))

export default products
