import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import categories from './schema'

export default class CategoryValidations {
  createSchema = createInsertSchema(categories, {
    name: z
      .string({ required_error: 'The name field is required' })
      .min(3, 'The name must be at least 3 characters')
      .trim(),
  })

  create = z.object({
    body: this.createSchema.omit({
      slug: true,
    }),
  })
}
