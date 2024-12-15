import { eq } from 'drizzle-orm'

import db from '../../db'
import users from './schema'
import { InsertUser, RetrieveUser } from './types'

export default class UserServices {
  /**
   * Register User
   */
  register = async (userInfo: InsertUser) => {
    const [user] = await db
      .insert(users)
      .values(userInfo)
      .returning({ id: users.id })

    return await this.retrieve({ id: user.id })
  }

  /**
   * Get single user by query
   */
  retrieve = async (query: RetrieveUser) =>
    await db.query.users.findFirst({
      where: query.id
        ? eq(users.id, query.id)
        : query.email
        ? eq(users.email, query.email)
        : undefined,
      columns: query.password === true ? undefined : { password: false },
    })
}
