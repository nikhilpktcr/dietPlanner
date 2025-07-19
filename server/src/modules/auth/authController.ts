import { Request, Response } from "express";
import { TUser, TCreateUserBody, TUserLoginBody } from "../../types/userTypes";
import * as authService from "./authService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import messages from "./authMessage";
import { TGetAllQueryParams } from "../../types";
import { ERoles } from "../../constants";

export const register = async (req: Request, res: Response) => {
  try {
    const body: TUser = req.body;
    const createUserBody: TCreateUserBody = {
      name: body.name,
      email: body.email,
      password: body.password,
      age: body.age,
      gender: body.gender,
    };
    const user = await authService.register(createUserBody);
    sendSuccessResponse(
      StatusCodes.CREATED,
      req,
      res,
      user,
      messages.CREATE_USER_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const createLoginBody: TUserLoginBody = {
      email,
      password,
    };
    const response = await authService.login(createLoginBody);
    sendSuccessResponse(
      StatusCodes.CREATED,
      req,
      res,
      response,
      messages.LOGIN_SUCCESS
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.UNAUTHORIZED, req, res, {}, errorMessage);
  }
};
