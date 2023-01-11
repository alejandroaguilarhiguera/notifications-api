import Boom from "@hapi/boom";
import { Request, Response, NextFunction } from "express";
import { ValidationErrorItem } from "sequelize";
import { RequestError } from "../types/RequestError";

const cleanErrors = (
  errors: ValidationErrorItem[],
): { message: string; field: string; value: string }[] =>
  errors.map(({ message, path, value }) => ({ message, field: path, value }));

export default (
  e: RequestError,
  req: Request,
  res: Response,
  next?: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): Response => {
  if (process.env.NODE_ENV !== "test") {
    console.error("ErrorHandler", { e });
  }

  if (Boom.isBoom(e)) {
    if (Array.isArray(e.data)) {
      return res
        .status(e.output.statusCode)
        .json({ ...e.output.payload, validationErrors: e.data });
    }
    return res
      .status(e.output.statusCode)
      .json({ ...e.output.payload, data: e.data });
  }

  if (e.name === "SequelizeValidationError") {
    return res.status(422).json({
      statusCode: 422,
      error: "Unprocessable Entity",
      message: "Validation errors",
      validationErrors: cleanErrors(e.errors),
    });
  }
  if (Array.isArray(e.errors)) {
    return res.status(422).json({
      statusCode: 422,
      error: "Unprocessable Entity",
      message: "Validation errors",
      validationErrors: e.errors,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    return res.status(500).json({
      statusCode: 500,
      error: e.name,
      message: e.message,
      errors: e.errors,
      stack: e.stack ? e.stack.split("\n") : null,
      sql: e.sql,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: "An unknown error occurred on the server",
  });
};
