import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { ErrorResponse } from '../utils/errors'

const storage = multer.memoryStorage()

const imageExtensions = ['png', 'jpeg', 'jpg']

const verifyImageFile = (file: Express.Multer.File): boolean =>
  imageExtensions.includes(file.mimetype.split('/')[1])

const onlyImage = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file) {
    const isImage = verifyImageFile(file)

    if (isImage) {
      cb(null, true)
    } else {
      cb(new ErrorResponse('You can only upload an image', 400))
    }
  }
}

export const uploadImage = multer({
  storage,
  fileFilter: onlyImage,
  limits: { fileSize: (1 * 1024 * 1024) / 2 }, // ~500k file size limit
})
