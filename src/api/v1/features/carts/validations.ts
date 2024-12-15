import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import cartItems from './schema'

export default class CartValidations {
  private createSchema = createInsertSchema(cartItems, {
    productId: z
      .string({
        required_error: 'The productId is required',
      })
      .uuid({ message: 'The productId must be a valid uuid' }),
    quantity: z
      .number({
        message: 'The quantity is required and it must be a number',
      })
      .min(1, 'The quantity must be a minimum of one'),
  })

  create = z.object({
    body: this.createSchema.omit({ userId: true }),
  })

  list = z.object({
    query: z.object({
      productId: z
        .string()
        .uuid({ message: 'The productId must be a valid uuid' })
        .optional(),
    }),
  })

  private paramsSchema = z.object({
    productId: z
      .string({
        required_error: 'The productId is required',
      })
      .uuid({ message: 'The productId must be a valid uuid' }),
  })

  retrieve = z.object({
    params: this.paramsSchema,
  })

  private updateSchema = z.object({
    quantity: z
      .number({
        message: 'The quantity is required and it must be a number',
      })
      .min(1, 'The quantity must be a minimum of one'),
  })

  update = z.object({
    body: this.updateSchema,
    params: this.paramsSchema,
  })
}
