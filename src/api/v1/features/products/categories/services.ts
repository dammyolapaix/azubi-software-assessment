import db from '../../../db'
import categories from './schema'
import { InsertCategory } from './types'

export default class CategoryServices {
  create = async (categoryInfo: InsertCategory) =>
    await db.insert(categories).values(categoryInfo).returning()
}
