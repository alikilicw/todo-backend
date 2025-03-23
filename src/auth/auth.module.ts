import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer'
import { UserModule } from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { mailConfig } from './otp/otp.config'
import { OtpService } from './otp/otp.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
    imports: [
        forwardRef(() => UserModule),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): MailerOptions => mailConfig(configService)
        }),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('ACCESS_TOKEN_SECRET_KEY')
            })
        })
    ],
    providers: [AuthService, OtpService, JwtStrategy],
    controllers: [AuthController],
    exports: [JwtModule, PassportModule]
})
export class AuthModule {}
