import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
    @Prop({ unique: true, required: true })
    username: string

    @Prop({ unique: true, required: true })
    email: string

    @Prop({ default: false })
    isActive: boolean

    @Prop({ required: true, select: false })
    password: string

    @Prop({ select: false })
    confirmCode: string
}

export const UserSchema = SchemaFactory.createForClass(User)
