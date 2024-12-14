import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import products from './schema'

export default class ProductValidations {
  createSchema = createInsertSchema(products, {
    name: z
      .string({ required_error: 'The name field is required' })
      .min(3, 'The name must be at least 3 characters')
      .trim(),
    price: z.coerce
      .number({
        message: 'The price is required and it must be a number',
      })
      .min(0.1, 'The price must be greater than 0')
      .transform((val) => val * 100),
    categoryId: z
      .string({
        required_error: 'The categoryId is required',
      })
      .uuid({ message: 'The categoryId must be a valid uuid' }),
  })

  create = z.object({
    body: this.createSchema.omit({
      slug: true,
      isPublished: true,
    }),
  })
}
