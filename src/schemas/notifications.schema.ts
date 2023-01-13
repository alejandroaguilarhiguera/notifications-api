import Joi from "@hapi/joi";
import { CustomSchema } from "../types/Schemas";

const customersSchema: CustomSchema = {
  post: {
    body: Joi.object().keys({
      category: Joi.string()
      .valid("sports", "finance", "movies")
      .required(),
      channel: Joi.string()
        .valid("sms", "email", "pushNotification")
        .required(),
      message: Joi.string().required(),
      UserId: Joi.number().required(),
    }),
  },
  patch: {
    body: Joi.object().keys({
      category: Joi.string()
      .valid("sports", "finance", "movies")
      .optional(),
      channel: Joi.string()
        .valid("sms", "email", "pushNotification")
        .optional(),
      message: Joi.string().optional(),
    }),
  },
};

export default customersSchema;
