import { Module } from '@nestjs/common'
import { S3Service } from './file-handling/s3.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { OpenAiService } from './openai/openai.service'

@Module({
    providers: [S3Service, JwtAuthGuard, OpenAiService],
    exports: [S3Service, JwtAuthGuard, OpenAiService]
})
export class CommonModule {}
