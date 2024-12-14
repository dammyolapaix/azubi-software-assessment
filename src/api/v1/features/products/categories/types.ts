import { Request } from 'express'
import categories from './schema'

export type Category = typeof categories.$inferSelect

export type InsertCategory = typeof categories.$inferInsert

export type RetrieveCategoryRequestType = Request<
  { categoryId?: string },
  {},
  { categoryId?: string },
  {}
> & {
  category?: Category
}
