import { afterAll } from '@jest/globals'
import db from './db'
import * as schema from './db/schema'

afterAll(async () => {
  for (const table of [
    schema.products,
    schema.categories,
    schema.cartItems,
    schema.users,
  ]) {
    await db.delete(table)
  }
})
