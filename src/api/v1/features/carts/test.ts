import { faker } from '@faker-js/faker'
import { beforeAll, describe, expect, it } from '@jest/globals'
import slugify from 'slugify'
import request from 'supertest'
import app from '../../app'
import productInstance from '../products'
import categoryInstance from '../products/categories'
import { InsertProduct } from '../products/types'
import userInstance from '../users'
import { InsertUser } from '../users/types'
import { InsertCartItem } from './types'

const createRandomUser = async (role?: 'admin') => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: await userInstance.utils.hashPassword(
      faker.internet.password({ length: 20 })
    ),
    role,
  }
}

const createRandomProduct = () => {
  return {
    name: faker.commerce.productName(),
    price: Number(faker.commerce.price()) * 100,
  }
}

const createRandomCategory = () => {
  return {
    name: faker.commerce.productName(),
  }
}

const randomCategory = createRandomCategory()

const randomUsers = [createRandomUser(), createRandomUser('admin')]

let product: Partial<InsertProduct> = createRandomProduct()

let customerUserToken: string | undefined = undefined
let adminUserToken: string | undefined = undefined

let cartItem: Omit<InsertCartItem, 'userId'> | undefined = undefined

describe('POST /carts', () => {
  beforeAll(async () => {
    const users = await userInstance.services.register(
      randomUsers as unknown as InsertUser
    )

    const getUserTokens = await Promise.all(
      users.map(async ({ id }) => await userInstance.utils.signToken({ id }))
    )

    customerUserToken = getUserTokens[0]
    adminUserToken = getUserTokens[1]

    const [category] = await categoryInstance.services.create({
      ...randomCategory,
      slug: slugify(randomCategory.name, { lower: true }),
    })

    product = {
      ...product,
      slug: slugify(product.name!, { lower: true }),
      categoryId: category.id,
    }

    const [createdProduct] = await productInstance.services.create(
      product as InsertProduct
    )

    cartItem = {
      productId: createdProduct.id,
      quantity: 2,
    }
  })

  describe('Add to cart', () => {
    describe('Given that user is not authenticated', () => {
      it('should return a 401 status code', async () => {
        const response = await request(app).post('/api/v1/carts').send(cartItem)

        expect(response.statusCode).toBe(401)
      })
    })

    describe('Given that user is authenticated as a "customer"', () => {
      it('should return a 201 status code', async () => {
        const response = await request(app)
          .post('/api/v1/carts')
          .set('Authorization', `Bearer ${customerUserToken}`)
          .send(cartItem)

        expect(response.statusCode).toBe(201)
      })
    })

    describe('Given that user is authenticated as an "admin"', () => {
      it('should return a 403 status code', async () => {
        const response = await request(app)
          .post('/api/v1/carts')
          .set('Authorization', `Bearer ${adminUserToken}`)
          .send(cartItem)

        expect(response.statusCode).toBe(403)
      })
    })
  })
})
