import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import env from '../env'

class S3 {
  private client = new S3Client({
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
    region: env.AWS_BUCKET_REGION,
  })

  get = async (Key: string) => {
    const expiresIn = 60 * 5 // 5 mins,

    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key,
    })
    return await getSignedUrl(this.client, command, { expiresIn })
  }

  put = async ({
    Key,
    Body,
    ContentType,
  }: {
    Key: string
    Body: Express.Multer.File['buffer']
    ContentType: string
  }) => {
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key,
      ContentType,
      Body,
    })

    return await this.client.send(command)
  }

  delete = async (Key: string) => {
    const command = new DeleteObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key,
    })

    return await this.client.send(command)
  }
}

const s3 = new S3()

export default s3
