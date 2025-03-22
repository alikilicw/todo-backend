import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }

    @Get('files')
    async getFile(@Query() query: { fileKey: string }, @Res() res: Response) {
        const file = await this.appService.getFile(query.fileKey)

        res.set({ 'Content-Type': file.contentType })

        return file.stream.pipe(res)
    }
}
