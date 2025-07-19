// /middleware/globalErrorHandler.ts
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { sendErrorResponse } from "../utils/responseUtil";

// Global error handler
export const globalErrorHandler = (err: Error, req: Request, res: Response) => {
  sendErrorResponse(
    StatusCodes.INTERNAL_SERVER_ERROR,
    req,
    res,
    err,
    err.message
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  sendErrorResponse(
    StatusCodes.NOT_FOUND,
    req,
    res,
    null,
    `Route ${req.originalUrl} not found`
  );
  next();
};
