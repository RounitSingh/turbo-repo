import { NextFunction, Request, Response } from "express";
import { winstonLogger as log } from "@repo/logger";
import { ApiError } from "../utils/ApiError.js";

const isPgError = (
  err: unknown,
): err is { code: string; detail?: string; message?: string } =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  typeof (err as { code: unknown }).code === "string";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    log.warn(err.message, {
      method: req.method,
      url: req.url,
      statusCode: err.statusCode,
      errors: err.errors,
    });
    res.status(err.statusCode).json(err.toJSON());
    return;
  }

  if (isPgError(err) && err.code === "23505") {
    res.status(409).json({
      success: false,
      statusCode: 409,
      message: "A user with this email already exists",
      errors: null,
      payload: null,
    });
    return;
  }

  const errorMessage = err instanceof Error ? err.message : "Unknown error";
  const errorName = err instanceof Error ? err.name : "Unknown";
  const errorStack = err instanceof Error ? err.stack : undefined;

  log.error(`${errorName}: ${errorMessage}`, {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    stack: errorStack,
  });

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: errorMessage,
    errors: null,
    payload: null,
  });
};
