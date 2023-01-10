import { CommonErrorProperties, ValidationError } from "sequelize";

export type RequestError = Error &
  ValidationError &
  CommonErrorProperties & {
    statusCode: number;
  };
