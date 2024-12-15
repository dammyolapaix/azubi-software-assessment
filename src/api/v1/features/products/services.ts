import { and, eq, gte, ilike, isNull, lte, or } from 'drizzle-orm'
import db from '../../db'
import images from './images/schema'
import { Image } from './images/types'
import products from './schema'
import {
  InsertProduct,
  InsertProductWithImage,
  ListProduct,
  Product,
} from './types'

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
      with: {
        category: true,
        image: true,
      },
    })

  /**
   * The list function get a list of products
   */
  list = async (query: ListProduct) =>
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
      with: {
        category: true,
        image: true,
      },
    })

  update = async (
    productId: string,
    productInfo: Partial<InsertProductWithImage>,
    productImage?: Image | null
  ) => {
    const { image, ...productOnly } = productInfo

    let imageId: string | null = null

    let product: Product | undefined = undefined

    await db.transaction(async (tx) => {
      // Create product if productImage is null
      if (productImage === null && image) {
        const [createdImage] = await tx.insert(images).values(image).returning()

        if (!createdImage) tx.rollback()

        imageId = createdImage.id
      }

      // Update product if productImage is not null
      if (productImage && image) {
        const [updatedImage] = await tx
          .update(images)
          .set(image)
          .where(eq(images.id, productImage.id))
          .returning()

        if (!updatedImage) tx.rollback()

        imageId = updatedImage.id
      }

      const [updatedProduct] = await tx
        .update(products)
        .set({ ...productOnly, imageId })
        .where(eq(products.id, productId))
        .returning()

      if (!updatedProduct) tx.rollback()

      product = updatedProduct
    })

    if (product) return await this.list({})
  }
}
