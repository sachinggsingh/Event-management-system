import Joi from "joi"

export const ValidateMessage = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        message: Joi.string().required()
    })
    return schema.validate(data)
}