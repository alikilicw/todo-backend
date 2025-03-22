import { Module } from '@nestjs/common'
import { S3Service } from './file-handling/s3.service'

@Module({
    providers: [S3Service],
    exports: [S3Service]
})
export class CommonModule {}
