import crypto from 'crypto'
import { NextFunction, Request, Response } from 'express'
import slugify from 'slugify'
import productInstance from '.'
import asyncHandler from '../../middlewares/async'
import { ErrorResponse } from '../../utils/errors'
import s3 from '../../utils/s3'
import {
  InsertProduct,
  InsertProductWithImage,
  RetrieveProductRequestType,
} from './types'

export default class ProductMiddlewares {
  create = asyncHandler(
    async (
      req: Request<{}, {}, InsertProduct, {}>,
      res: Response,
      next: NextFunction
    ) => {
      req.body.slug = slugify(req.body.name, { lower: true })

      const product = await productInstance.services.retrieve({
        slug: req.body.slug,
      })

      if (product)
        return next(new ErrorResponse(`Product already created`, 400))

      next()
    }
  )

  retrieve = asyncHandler(
    async (
      req: RetrieveProductRequestType,
      res: Response,
      next: NextFunction
    ) => {
      let productId: string | undefined = undefined

      if (req.params.id) productId = req.params.id
      if (req.body.productId) productId = req.body.productId

      if (req.params.id || req.body.productId) {
        req.product = await productInstance.services.retrieve({
          id: productId!,
          isDeleted: req.path === `/${productId}/restore` ? true : undefined,
        })

        if (!req.product)
          return next(
            new ErrorResponse(
              `Can't find product with the id of ${productId}`,
              404
            )
          )
      }

      next()
    }
  )

  private getFileKey = (fileName: string, fileMimetype: string) => {
    const uniqueSuffix = crypto.randomBytes(20).toString('hex')

    const Key = `uploads/${fileName.replace(' ', '-')}-${uniqueSuffix}.${
      fileMimetype.split('/')[1]
    }`

    return Key
  }

  update = asyncHandler(
    async (
      req: Request<{ id: string }, {}, InsertProductWithImage, {}>,
      res: Response,
      next: NextFunction
    ) => {
      const { name, price, categoryId, isPublished } = req.body
      type ReqFiles = {
        desktop?: Express.Multer.File[]
        mobile?: Express.Multer.File[]
        thumbnail?: Express.Multer.File[]
        tablet?: Express.Multer.File[]
      }

      const images = req.files as ReqFiles | undefined

      if (images && images['desktop']) {
        const image = images['desktop'][0]

        req.body = {
          ...req.body,
          image: {
            ...req.body.image,
            desktop: this.getFileKey(image?.originalname!, image?.mimetype!),
          },
        }

        await s3.put({
          Key: req.body.image.desktop!,
          Body: image.buffer,
          ContentType: image.mimetype,
        })
      }

      if (images && images['mobile']) {
        const image = images['mobile'][0]

        req.body = {
          ...req.body,
          image: {
            ...req.body.image,
            mobile: this.getFileKey(image?.originalname!, image?.mimetype!),
          },
        }

        await s3.put({
          Key: req.body.image.mobile!,
          Body: image.buffer,
          ContentType: image.mimetype,
        })
      }

      if (images && images['tablet']) {
        const image = images['tablet'][0]

        req.body = {
          ...req.body,
          image: {
            ...req.body.image,
            tablet: this.getFileKey(image?.originalname!, image?.mimetype!),
          },
        }

        await s3.put({
          Key: req.body.image.tablet!,
          Body: image.buffer,
          ContentType: image.mimetype,
        })
      }

      if (images && images['thumbnail']) {
        const image = images['thumbnail'][0]

        req.body.image.thumbnail = this.getFileKey(
          image?.originalname!,
          image?.mimetype!
        )

        req.body = {
          ...req.body,
          image: {
            ...req.body.image,
            thumbnail: this.getFileKey(image?.originalname!, image?.mimetype!),
          },
        }
        await s3.put({
          Key: req.body.image.thumbnail!,
          Body: image.buffer,
          ContentType: image.mimetype,
        })
      }

      if (req.body.name) {
        req.body.slug = slugify(req.body.name, { lower: true })

        const product = await productInstance.services.retrieve({
          slug: req.body.slug,
        })

        if (product)
          return next(
            new ErrorResponse(
              `Product already existed, please try different name`,
              400
            )
          )
      }

      if (!name && !price && !categoryId && !isPublished && !req.body.image)
        return next(
          new ErrorResponse(
            'You must provide one of these to update a product. "name", "price", "categoryId", "image", or "isPublished"',
            400
          )
        )

      next()
    }
  )
}
