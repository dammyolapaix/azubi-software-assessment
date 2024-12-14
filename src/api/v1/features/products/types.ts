import { z } from 'zod'
import product from '.'
import products from './schema'

export type Product = typeof products.$inferSelect

export type InsertProduct = typeof products.$inferInsert

export type ListPolicy = z.infer<typeof product.validations.list>['query']
