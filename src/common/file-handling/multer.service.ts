import { BadRequestException, Injectable } from '@nestjs/common'
import { mkdirSync } from 'fs'
import multer = require('multer')
import path = require('path')

export class MulterService {
    static storage = multer.diskStorage({
        destination: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
            const root = path.dirname(__dirname || '').split('dist')[0]

            mkdirSync(path.join(root, '/uploads'), { recursive: true })

            cb(null, path.join(root, '/uploads'))
        },
        filename: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
            cb(null, `${uniqueSuffix}-${file.originalname}`)
        }
    })

    static fileFilter = (req: Express.Request, file: Express.Multer.File, cb: Function) => {
        const fileType = file.fieldname

        if (fileType === 'thumbnail') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(
                    new BadRequestException('Only image files are allowed for thumbnails'),
                    false
                )
            }
        } else if (fileType === 'file') {
            const allowedFileTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ]
            if (!allowedFileTypes.includes(file.mimetype)) {
                return cb(
                    new BadRequestException('Only PDF or Word files are allowed for file'),
                    false
                )
            }
        }

        cb(null, true)
    }
}
