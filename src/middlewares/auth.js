const jwt = require("jsonwebtoken");
const joi = require("joi");
require("dotenv").config;
module.exports = {
  validation: (req, res, next) => {
    //register form validation
    const { body } = req;
    const registerSchema = joi.object({
      email: joi.string().required(),
      password: joi.string().required().min(3),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    });

    const validatePayloads = registerSchema.validate(body);

    if (!validatePayloads.error) {
      next();
    } else {
      res.status(400).json({
        error: true,
        error_message: validatePayloads.error,
        message: "failed validation",
      });
    }
  },

  authorization: (req, res, next) => {
    // check jwt token
    if (!req.headers.authorization) {
      res.status(401).json({
        message: "Unauthorized",
      });
    } else {
      const token = req.headers.authorization;
      try {
        const payload = jwt.verify(token, process.env.SECRETKEY);
        data = payload;
        next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          res.status(401).json({
            message: "Session is expired",
          });
        } else {
          res.status(401).json({
            message: "Unauthorized",
          });
        }
      }
    }
  },
};
