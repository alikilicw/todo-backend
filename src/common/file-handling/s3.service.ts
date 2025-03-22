import { Injectable, NotFoundException } from '@nestjs/common'
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import fs, { ReadStream } from 'fs'
import Stream from 'stream'

export type S3File = Express.Multer.File & {
    parentDir: string
}

@Injectable()
export class S3Service {
    private s3: S3Client
    private bucketName: string

    constructor(private readonly configService: ConfigService) {
        this.s3 = new S3Client({
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')
            }
        })
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')
    }

    async uploadFile(file: S3File) {
        const fileStream: ReadStream = fs.createReadStream(file.path)
        const fileKey = `${file.parentDir}/${file.filename}`

        const uploadParams = {
            Bucket: this.bucketName,
            Body: fileStream,
            Key: fileKey
        }

        const command = new PutObjectCommand(uploadParams)
        try {
            const response = await this.s3.send(command)
            return { Key: fileKey, ...response }
        } catch (err) {
            console.error('Error uploading file:', err)
            throw err
        }
    }

    async getFile(fileKey: string) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey
            })

            const response = await this.s3.send(command)
            return {
                stream: response.Body as Stream,
                contentType: response.ContentType
            }
        } catch (error) {
            throw new NotFoundException('File not found.')
        }
    }

    async deleteFile(fileKey: string) {
        const params = { Bucket: this.bucketName, Key: fileKey }
        await this.s3.send(new DeleteObjectCommand(params))
    }
}
