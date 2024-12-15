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
    body: this.createSchema,
  })
}
