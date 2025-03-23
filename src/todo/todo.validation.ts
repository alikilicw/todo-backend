import * as Joi from 'joi'
import BaseValidation from 'src/common/validation/base.validation'

export default class TodoValidation extends BaseValidation {
    public static create = Joi.object({
        title: Joi.string().min(5).max(50).required(),
        description: Joi.string().min(0).max(200).optional()
    })

    public static find = Joi.object({
        title: Joi.string().min(3).max(50).optional(),
        page: Joi.number().optional(),
        limit: Joi.number().optional()
    })

    public static update = Joi.object({
        title: Joi.string().min(5).max(50).optional(),
        description: Joi.string().min(0).max(200).optional()
    })
}
