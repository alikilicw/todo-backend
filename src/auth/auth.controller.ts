import { Body, Controller, Get, Post, Query, Request, UseGuards, UsePipes } from '@nestjs/common'
import { LoginReqDto, LoginResDto, RegisterReqDto, RegisterResDto } from './auth.dto'
import { AuthService } from './auth.service'
import { Response } from 'src/common/types/response.type'
import { User } from 'src/user/user.model'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import AuthValidation from './auth.validation'
import { JoiValidationPipe } from 'src/common/validation/validation.pipe'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    @UsePipes(new JoiValidationPipe({ bodySchema: AuthValidation.register }))
    async register(@Body() body: RegisterReqDto): Promise<Response<RegisterResDto>> {
        const response = await this.authService.register(body)
        return {
            data: response,
            message:
                "Your account has been successfully created! Please verify your email by checking on the mail we've sent to your inbox."
        }
    }

    @Post('login')
    @UsePipes(new JoiValidationPipe({ bodySchema: AuthValidation.login }))
    async login(@Body() body: LoginReqDto): Promise<Response<LoginResDto>> {
        const response = await this.authService.login(body)

        return {
            data: response,
            message: 'Login successfull.'
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('confirm')
    async confirm(@Query() query: { code: string }, @Request() req): Promise<Response<boolean>> {
        return {
            data: await this.authService.confirm(req.user, query.code)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('whoami')
    async whoami(@Request() req): Promise<Response<User>> {
        return {
            data: req.user
        }
    }
}
