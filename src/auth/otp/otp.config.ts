import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const mailConfig = (configService: ConfigService): MailerOptions => ({
    transport: {
        host: configService.get<string>('MAIL_HOST'),
        port: configService.get<number>('MAIL_PORT'),
        auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASS')
        }
    },
    defaults: {
        from: '"NestJS Mailer" ' + configService.get<string>('MAIL')
    }
})
