import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendErrorResponse } from "../utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/envConfig";
import { ERoles } from "../constants";

export const authorize = (...allowedRoles: ERoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(
        StatusCodes.UNAUTHORIZED,
        req,
        res,
        {},
        "unauthorized"
      );
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload["user"];
      if (!allowedRoles.includes(decoded.role)) {
        return sendErrorResponse(
          StatusCodes.FORBIDDEN,
          req,
          res,
          {},
          "Forbidden"
        );
      }

      (req as any).user = decoded; // Attach user info to request
      next();
    } catch (err) {
      return sendErrorResponse(
        StatusCodes.UNAUTHORIZED,
        req,
        res,
        {},
        "Invalid token"
      );
    }
  };
};
