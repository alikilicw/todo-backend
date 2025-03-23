import { forwardRef, Module } from '@nestjs/common'
import { CommonModule } from 'src/common/common.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserSchema } from './user.model'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
        forwardRef(() => AuthModule),
        CommonModule
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
