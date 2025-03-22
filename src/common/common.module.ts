import { Module } from '@nestjs/common'
import { MulterService } from './file-handling/multer.service'
import { S3Service } from './file-handling/s3.service'

@Module({
    providers: [MulterService, S3Service],
    exports: [MulterService, S3Service]
})
export class CommonModule {}
