import { User } from './user.model'

export type CreateUserDto = Pick<User, 'username' | 'email' | 'password'>
export type FindUserDto = {
    id?: number
    username?: string
    email?: string
}
export type UpdateUserDto = FindUserDto
