import { Module } from '@nestjs/common'
import { S3Service } from './file-handling/s3.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
    providers: [S3Service, JwtAuthGuard],
    exports: [S3Service, JwtAuthGuard]
})
export class CommonModule {}
