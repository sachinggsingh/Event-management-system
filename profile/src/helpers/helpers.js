import Joi from "joi";

export const ValidateProfile = (data) => {
    const schema = Joi.object({
        userId: Joi.string().optional(),
        bio: Joi.string().allow(""),
        interests: Joi.array().items(Joi.string()).default([]),
        skills: Joi.array().items(Joi.string()).default([]),
        experienceLevel: Joi.string().valid("Beginner", "Intermediate", "Expert").default("Beginner"),
    })
    return schema.validate(data)
}