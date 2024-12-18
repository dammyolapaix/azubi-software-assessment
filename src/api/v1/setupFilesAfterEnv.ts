import { afterAll } from '@jest/globals'
import db from './db'
import * as schema from './db/schema'

afterAll(async () => {
  for (const table of [
    schema.cartItems,
    schema.products,
    schema.categories,
    schema.users,
  ]) {
    await db.delete(table)
  }
})
