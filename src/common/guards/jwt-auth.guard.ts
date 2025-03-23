import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    override handleRequest(err: Error, user: any, info: any) {
        if (info?.name === 'TokenExpiredError') {
            throw new UnauthorizedException('Token expired.')
        } else if (info) {
            throw new UnauthorizedException('Invalid token.')
        } else if (err || !user) {
            throw new UnauthorizedException('Invalid token.')
        }
        return user
    }
}
