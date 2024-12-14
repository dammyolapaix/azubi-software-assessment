import { eq, or } from 'drizzle-orm'
import db from '../../../db'
import categories from './schema'
import { InsertCategory } from './types'

export default class CategoryServices {
  create = async (categoryInfo: InsertCategory) =>
    await db.insert(categories).values(categoryInfo).returning()

  retrieve = async (query: Partial<Pick<InsertCategory, 'slug' | 'id'>>) =>
    await db.query.categories.findFirst({
      where: or(
        query.slug ? eq(categories.slug, query.slug) : undefined,
        query.id ? eq(categories.id, query.id) : undefined
      ),
    })
}
