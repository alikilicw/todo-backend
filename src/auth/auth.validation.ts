import * as Joi from 'joi'

export default class AuthValidation {
    public static register = Joi.object({
        username: Joi.string().min(5).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6)
            .max(24)
            .pattern(
                new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[d$!?_.])[A-Za-z\\d$!?_.]{6,24}$')
            )
            .required()
            .messages({
                'string.pattern.base':
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ($!?_.).'
            })
    })

    public static login = Joi.object({
        username: Joi.string().min(5).max(20).required(),
        password: Joi.string().min(6).max(20).required()
    })
}
