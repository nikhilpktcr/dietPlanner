import { Request, Response } from "express";

export const sendErrorResponse = (
  statusCode: number,
  req: Request,
  res: Response,
  error: any,
  errorMessage: string
): void => {
  const requestId = req.headers["x-request-id"];
  const message = errorMessage || error?.message;
  res.status(statusCode).json({ success: false, requestId, error: message });
};

export const sendSuccessResponse = <T>(
  statusCode: number,
  req: Request,
  res: Response,
  data: T,
  successMessage: string
): void => {
  const requestId = req.headers["x-request-id"];
  res.status(statusCode).json({
    success: true,
    requestId,
    message: successMessage,
    response: data,
  });
};

export const sendValidationErrorResponse = <T>(
  statusCode: number,
  res: Response,
  validationData: T,
  errorMessage: string
): void => {
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    response: validationData,
  });
};
