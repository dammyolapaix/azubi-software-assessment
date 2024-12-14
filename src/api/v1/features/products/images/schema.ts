import { relations } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../../../db/helper'
import products from '../schema'

const images = pgTable('images', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  thumbnail: varchar({ length: 255 }),
  mobile: varchar({ length: 255 }),
  tablet: varchar({ length: 255 }),
  desktop: varchar({ length: 255 }),
  ...timestamps,
})

export const imagesRelations = relations(images, ({ one }) => ({
  category: one(products),
}))

export default images
