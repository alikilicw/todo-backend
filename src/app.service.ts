import { Injectable } from '@nestjs/common'
import { S3Service } from './common/file-handling/s3.service'
import { Response } from 'express'

@Injectable()
export class AppService {
    constructor(private readonly s3Service: S3Service) {}

    getHello(): string {
        return 'Hello World!'
    }

    async getFile(fileKey: string) {
        return this.s3Service.getFile(fileKey)
    }
}
