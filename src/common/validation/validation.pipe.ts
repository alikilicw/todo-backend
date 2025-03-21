import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { ObjectSchema } from 'joi'

type ValidationConstructor = {
    bodySchema?: ObjectSchema | null
    querySchema?: ObjectSchema | null
    paramSchema?: ObjectSchema | null
}

export class JoiValidationPipe implements PipeTransform {
    private bodySchema: ObjectSchema
    private querySchema: ObjectSchema
    private paramSchema: ObjectSchema

    constructor({
        bodySchema = null,
        querySchema = null,
        paramSchema = null
    }: ValidationConstructor) {
        this.bodySchema = bodySchema
        this.querySchema = querySchema
        this.paramSchema = paramSchema
    }

    transform(value: any, metadata: ArgumentMetadata) {
        if (this.bodySchema && metadata.type == 'body') {
            const { error } = this.bodySchema.validate(value)
            if (error) throw new BadRequestException(error.details[0].message)
        }

        if (this.querySchema && metadata.type == 'query') {
            const { error } = this.querySchema.validate(value)
            if (error) throw new BadRequestException(error.details[0].message)
        }

        if (this.paramSchema && metadata.type == 'param') {
            const { error } = this.paramSchema.validate(value)
            if (error) throw new BadRequestException(error.details[0].message)
        }

        return value
    }
}
