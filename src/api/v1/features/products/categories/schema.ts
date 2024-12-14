import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../../../db/helper'
import products from '../schema'

const categories = pgTable('categories', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 255 }).unique().notNull(),
  slug: varchar({ length: 255 }).unique().notNull(),
  ...timestamps,
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}))

export default categories
