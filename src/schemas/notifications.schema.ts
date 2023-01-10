import Joi from "@hapi/joi";
import { CustomSchema } from "../types/Schemas";

const customersSchema: CustomSchema = {
  post: {
    body: Joi.object().keys({
      channel: Joi.string()
        .valid("sms", "email", "pushNotification")
        .required(),
      message: Joi.string().required(),
      UserId: Joi.number().allow(null).optional(),
    }),
  },
  patch: {
    body: Joi.object().keys({
      channel: Joi.string()
        .valid("sms", "email", "pushNotification")
        .optional(),
      message: Joi.string().optional(),
    }),
  },
};

export default customersSchema;
