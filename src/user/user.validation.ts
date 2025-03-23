import * as Joi from 'joi'
import BaseValidation from 'src/common/validation/base.validation'

export default class UserValidation extends BaseValidation {
    public static find = Joi.object({
        username: Joi.string().min(5).max(20).optional(),
        email: Joi.string().email().optional()
    })

    public static update = Joi.object({
        username: Joi.string().min(5).max(20).optional(),
        email: Joi.string().email().optional()
    })
}
