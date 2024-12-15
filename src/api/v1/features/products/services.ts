import { and, eq, gte, ilike, isNull, lte, or } from 'drizzle-orm'
import db from '../../db'
import products from './schema'
import { InsertProduct, ListPolicy, Product } from './types'

export default class ProductServices {
  create = async (productInfo: InsertProduct) =>
    await db.insert(products).values(productInfo).returning()

  /**
   * The retrieve function gets a single product
   */
  retrieve = async (
    query: Partial<Pick<Product, 'slug' | 'id'> & { isDeleted: boolean }>
  ) =>
    await db.query.products.findFirst({
      where: and(
        or(
          query.id ? eq(products.id, query.id) : undefined,
          query.slug ? eq(products.slug, query.slug) : undefined
        ),
        query.isDeleted === true ? undefined : isNull(products.deletedAt)
      ),
    })

  /**
   * The list function get a list of products
   */
  list = async (query: ListPolicy) =>
    await db.query.products.findMany({
      where: and(
        query.name ? ilike(products.name, `%${query.name}%`) : undefined,
        query.categoryId
          ? eq(products.categoryId, query.categoryId)
          : undefined,
        query.isPublished
          ? eq(products.isPublished, query.isPublished)
          : undefined,
        query.price?.eq ? eq(products.price, query.price.eq) : undefined,
        query.price?.lte ? lte(products.price, query.price.lte) : undefined,
        query.price?.gte ? gte(products.price, query.price.gte) : undefined,
        isNull(products.deletedAt)
      ),
    })

  update = async (productId: string, productInfo: Partial<InsertProduct>) =>
    await db
      .update(products)
      .set(productInfo)
      .where(eq(products.id, productId))
      .returning()
}
