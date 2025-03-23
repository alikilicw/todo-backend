import { User } from 'src/user/user.model'
import { CreateUserDto } from 'src/user/user.type'

type AuthReqBaseDto = {
    username: string
    password: string
}

type AuthResBaseDto = {
    token: string
}

export type LoginReqDto = AuthReqBaseDto

export type LoginResDto = AuthResBaseDto & {
    user: User
}

export type RegisterReqDto = CreateUserDto
export type RegisterResDto = AuthResBaseDto
