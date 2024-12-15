import { Request } from 'express'
import { z } from 'zod'
import product from '.'
import { Category } from './categories/types'
import { Image, InsertImage } from './images/types'
import products from './schema'

export type Product = typeof products.$inferSelect

export type InsertProduct = typeof products.$inferInsert

export type ListProduct = z.infer<typeof product.validations.list>['query']

export type RetrieveProductRequestType = Request<
  { id?: string },
  {},
  { productId?: string },
  {}
> & {
  product?: Product
}

export type InsertProductWithImage = InsertProduct & { image: InsertImage }

export type ProductWithRelationships = Product & {
  image: Image | null
  category: Category | null
}
