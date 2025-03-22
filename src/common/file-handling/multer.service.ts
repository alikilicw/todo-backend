import { Injectable } from '@nestjs/common'
import { existsSync, mkdirSync } from 'fs'
import multer from 'multer'
import { join } from 'path'

@Injectable()
export class MulterService {
    private storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(__dirname, '../../uploads')

            if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true })

            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
            cb(null, `${uniqueSuffix}-${file.originalname}`)
        }
    })

    private upload = multer({ storage: this.storage })

    getMulter() {
        return this.upload
    }
}
