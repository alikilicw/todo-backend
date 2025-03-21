import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

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
}

export const TodoSchema = SchemaFactory.createForClass(Todo)
