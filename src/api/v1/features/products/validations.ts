import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import products from './schema'

export default class ProductValidations {
  private booleanSchema = z
    .union([z.boolean(), z.string()])
    .refine(
      (value) => {
        if (typeof value === 'string') {
          return value === 'true' || value === 'false'
        }
        return true
      },
      {
        message:
          'isPublished query must be a Boolean or "true" or "false" as a string.',
      }
    )
    .transform((value) => {
      if (typeof value === 'string') {
        return value === 'true'
      }
      return value
    })

  private createSchema = createInsertSchema(products, {
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

  private listSchema = createInsertSchema(products, {
    name: z.string().optional(),
    price: z
      .object({
        eq: z.coerce
          .number({
            message: 'The price is required and it must be a number',
          })
          .transform((val) => val * 100)
          .optional(),
        lte: z.coerce
          .number({
            message: 'The price is required and it must be a number',
          })
          .transform((val) => val * 100)
          .optional(),
        gte: z.coerce
          .number({
            message: 'The price is required and it must be a number',
          })
          .transform((val) => val * 100)
          .optional(),
      })
      .optional(),
    categoryId: z
      .string()
      .uuid({ message: 'The categoryId must be a valid uuid' })
      .optional(),
    isPublished: this.booleanSchema.optional(),
  }).omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    imageId: true,
  })

  list = z.object({
    query: this.listSchema,
  })

  private paramsSchema = z.object({
    id: z
      .string({
        required_error: 'The id is required',
      })
      .uuid({ message: 'The id must be a valid uuid' }),
  })

  retrieve = z.object({
    params: this.paramsSchema,
  })

  private updateSchema = createInsertSchema(products, {
    name: z.string().optional(),
    price: z.coerce
      .number({
        message: 'The price is required and it must be a number',
      })
      .min(0.1, 'The price must be greater than 0')
      .transform((val) => val * 100)
      .optional(),
    categoryId: z
      .string()
      .uuid({ message: 'The categoryId must be a valid uuid' })
      .optional(),
    isPublished: this.booleanSchema.optional(),
  }).omit({ slug: true })

  update = z.object({
    body: this.updateSchema,
    params: this.paramsSchema,
  })
}
