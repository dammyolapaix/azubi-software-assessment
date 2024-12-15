import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import user from '.'
import { ROLES } from '../../utils/constants'
import users from './schema'

export default class UserValidations {
  private registerSchema = createInsertSchema(users, {
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, 'Name must be at least 3 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email must be a valid email')
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .refine((password) => user.utils.isPasswordStrong(password), {
        message:
          'Your password is weak, please make sure it contains at least a capital and a small letter, a number, and a special character',
      }),
    role: z
      .enum(ROLES, {
        message: "The role method must be one of these 'admin', or 'customer'",
      })
      .optional(),
  })

  register = z.object({
    body: this.registerSchema,
  })

  login = z.object({
    body: this.registerSchema.pick({ email: true, password: true }),
  })
}
