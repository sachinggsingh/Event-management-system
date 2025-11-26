import Joi from "joi";

export const validateEvent = (data) => {
  const schema = Joi.object({
    time: Joi.date().required(),
    venue: Joi.string().required(),
    description: Joi.string().required(),
    topic: Joi.string().required(),
    benefits: Joi.string()
  });

  return schema.validate(data);
};
