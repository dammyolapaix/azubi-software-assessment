import {
  and,
  eq,
  getTableColumns,
  gte,
  ilike,
  isNull,
  lte,
  or,
  sql,
} from 'drizzle-orm'
import db from '../../db'
import s3 from '../../utils/s3'
import categories from './categories/schema'
import images from './images/schema'
import { Image } from './images/types'
import products from './schema'
import {
  InsertProduct,
  InsertProductWithImage,
  ListProduct,
  Product,
  ProductWithRelationships,
} from './types'

export default class ProductServices {
  private updateImage = async (image: Image): Promise<Image> => {
    return {
      ...image,
      thumbnail: image.thumbnail
        ? await s3.get(image.thumbnail)
        : image.thumbnail,
      mobile: image.mobile ? await s3.get(image.mobile) : image.mobile,
      tablet: image.tablet ? await s3.get(image.tablet) : image.tablet,
      desktop: image.desktop ? await s3.get(image.desktop) : image.desktop,
    }
  }

  private updateProductsImages = async (
    products: ProductWithRelationships[]
  ): Promise<ProductWithRelationships[]> => {
    const updatedProducts = await Promise.all(
      products.map(async (product) => {
        if (product.image) {
          // If the product has an image, update it
          const updatedImage = await this.updateImage(product.image)
          return { ...product, image: updatedImage }
        }
        // If no image exists, return the product as is
        return product
      })
    )

    return updatedProducts
  }

  create = async (productInfo: InsertProduct) =>
    await db.insert(products).values(productInfo).returning()

  /**
   * The retrieve function gets a single product
   */
  retrieve = async (
    query: Partial<Pick<Product, 'slug' | 'id'> & { isDeleted: boolean }>
  ) => {
    const queryResults = await db.query.products.findFirst({
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

    if (queryResults && queryResults.image) {
      const productImage = await this.updateImage(queryResults.image)

      return {
        ...queryResults,
        price: queryResults.price! / 100,
        image: productImage,
      }
    }
  }

  /**
   * The list function get a list of products
   */
  list = async (query: ListProduct) => {
    const queryResults = await db
      .select({
        ...getTableColumns(products),
        price: sql<number>`${products.price} / 100`.mapWith(Number),
        category: {
          ...getTableColumns(categories),
        },
        image: {
          ...getTableColumns(images),
        },
      })
      .from(products)
      .leftJoin(categories, eq(categories.id, products.categoryId))
      .leftJoin(images, eq(images.id, products.imageId))
      .where(
        and(
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
        )
      )

    if (queryResults) {
      return await this.updateProductsImages(queryResults)
    }
  }

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

    if (product) return await this.retrieve({ id: productId })
  }
}
