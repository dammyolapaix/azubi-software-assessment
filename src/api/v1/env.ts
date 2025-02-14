import { config } from 'dotenv'
import { expand } from 'dotenv-expand'

import { ZodError, z } from 'zod'

const stringBoolean = z.coerce
  .string()
  .transform((val) => {
    return val === 'true'
  })
  .default('false')

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  TEST_DATABASE_URL: z.string(),
  FRONTEND_URL: z.string(),
  AUTH_SECRET: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_BUCKET_REGION: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  DB_MIGRATING: stringBoolean,
  DB_SEEDING: stringBoolean,
  TESTING: stringBoolean,
})

export type EnvSchema = z.infer<typeof EnvSchema>

expand(config())

try {
  EnvSchema.parse(process.env)
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n'
    error.issues.forEach((issue) => {
      message += issue.path[0] + '\n'
    })
    const e = new Error(message)
    e.stack = ''
    throw e
  } else {
    console.error(error)
  }
}

export default EnvSchema.parse(process.env)
