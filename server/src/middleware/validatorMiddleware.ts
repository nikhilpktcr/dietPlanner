import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { sendErrorResponse } from "../utils/responseUtil";

export const validatorFn = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendErrorResponse(
      400,
      req,
      res,
      "validation failed",
      JSON.stringify(errors.array())
    );
  }
  next();
};
