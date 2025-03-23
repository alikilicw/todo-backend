import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import { User } from 'src/user/user.model'
import { OtpService } from 'src/auth/otp/otp.service'
import generateRandomVerificationCode from 'src/common/util/generate-code'
import { UserService } from 'src/user/user.service'
import { LoginReqDto, LoginResDto, RegisterReqDto, RegisterResDto } from './auth.dto'
import { hash, compare } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { sign } from 'jsonwebtoken'
import { StringValue } from 'ms'

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private otpService: OtpService,
        private readonly configService: ConfigService
    ) {}

    async register(registerReqDto: RegisterReqDto): Promise<RegisterResDto> {
        const userCheckUsername = await this.userService.findByUsername(registerReqDto.username)
        if (userCheckUsername) throw new BadRequestException('Username in use.')

        const userCheckEmail = await this.userService.findByEmail(registerReqDto.email)
        if (userCheckEmail) throw new BadRequestException('Email in use.')

        registerReqDto.password = await hash(registerReqDto.password, 10)

        let user = await this.userService.create(registerReqDto)

        const confirmationCode = generateRandomVerificationCode()

        user.confirmCode = confirmationCode

        await user.save()

        this.otpService.sendMail(user.email, confirmationCode)
        const token = await this.createToken(user, '3m')
        return {
            token
        }
    }

    async login(loginReqDto: LoginReqDto): Promise<LoginResDto> {
        const user = await this.userService.findByUsername(loginReqDto.username, '+password', true)
        if (!user) throw new NotFoundException('User not found.')
        if (!user.isActive) throw new BadRequestException('Verify email first.')

        const passOk = await compare(loginReqDto.password, user.password)
        if (!passOk) throw new BadRequestException('Password is incorrect.')

        const token = await this.createToken(user, '30d')

        delete user.password

        return {
            user,
            token
        }
    }

    async createToken(user: User, expiresIn: StringValue): Promise<string> {
        return sign(
            { id: user._id, username: user.username },
            this.configService.get<string>('ACCESS_TOKEN_SECRET_KEY'),
            { expiresIn }
        )
    }

    async confirm(user: User, code: string): Promise<boolean> {
        if (code != user.confirmCode) throw new UnauthorizedException('Invalid code.')

        user.isActive = true
        user.confirmCode = null
        await user.save()

        return true
    }
}
