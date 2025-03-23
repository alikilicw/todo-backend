import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { Document } from 'mongoose'
import { User } from 'src/user/user.model'

@Schema({ timestamps: true, versionKey: false })
export class Todo extends Document {
    @Prop({ required: true })
    title: string

    @Prop()
    description: string

    @Prop()
    thumbnailKey: string

    @Prop()
    fileKey: string

    @Prop({ type: mongoose.Schema.ObjectId, ref: User.name, required: true })
    user: User
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
