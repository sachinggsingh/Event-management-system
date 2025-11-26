import jwt from "jsonwebtoken";
import Joi from "joi";
import bcrypt from "bcrypt";
export const GenerateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};

export const GenerateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

export const VerifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return error;
  }
};

export const VerifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return error;
  }
};

export const ValidateSignUp = (data) => {
  const schema = Joi.object({
    Username: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .pattern(/^[a-zA-Z0-9_]+$/)
      .required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username must not exceed 20 characters",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),

    Email: Joi.string()
      .trim()
      .lowercase()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "in"] },
      })
      .required()
      .messages({
        "string.email": "Please enter a valid email address",
        "string.empty": "Email is required",
      }),

    Password: Joi.string()
      .trim()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  });

  return schema.validate(data, { abortEarly: false });
};
export const ValidateLogin = (data) => {
  const schema = Joi.object({
    Email: Joi.string()
      .trim()
      .lowercase()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "org", "in"] },
      })
      .messages({
        "string.email": "Please enter a valid email address",
      }),

    Password: Joi.string().trim().min(8).max(30).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
    }),
  }).messages({
    "object.missing": "Email is required for login",
  });

  return schema.validate(data, { abortEarly: false });
};

export const HashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const ComparePassword = async (hash, password) => {
  return await bcrypt.compare(hash, password);
};
