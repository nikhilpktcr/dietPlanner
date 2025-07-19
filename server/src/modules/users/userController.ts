// import { Request, Response } from "express";
// import { TUser, TCreateUserBody, TUserLoginBody } from "../../types/userTypes";
// import * as userService from "./userService";
// import {
//   sendErrorResponse,
//   sendSuccessResponse,
// } from "../../utils/responseUtil";
// import { StatusCodes } from "http-status-codes";
// import messages from "./userMessage";
// import { TGetAllQueryParams } from "../../types";

// export const register = async (req: Request, res: Response) => {
//   try {
//     const body: TUser = req.body;
//     const createUserBody: TCreateUserBody = {
//       name: body.name,
//       email: body.email,
//       password: body.password,
//       phone: body.phone,
//     };
//     const user = await userService.registerUser({
//       ...createUserBody,
//       role: "user",
//     });
//     sendSuccessResponse(
//       StatusCodes.CREATED,
//       req,
//       res,
//       user,
//       messages.CREATE_USER_SUCCESS
//     );
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
//   }
// };

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const createLoginBody: TUserLoginBody = {
//       email,
//       password,
//     };
//     const response = await userService.loginUser(createLoginBody);
//     sendSuccessResponse(
//       StatusCodes.CREATED,
//       req,
//       res,
//       response,
//       messages.LOGIN_SUCCESS
//     );
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     sendErrorResponse(StatusCodes.UNAUTHORIZED, req, res, {}, errorMessage);
//   }
// };

// export const getAllUsers = async (req: Request, res: Response) => {
//   try {
//     const queryParams: TGetAllQueryParams = req.query as TGetAllQueryParams;
//     const users = await userService.getAllUsers(queryParams);
//     sendSuccessResponse(
//       StatusCodes.OK,
//       req,
//       res,
//       users,
//       messages.GET_ALL_USER_SUCCESS
//     );
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     sendErrorResponse(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       req,
//       res,
//       {},
//       errorMessage
//     );
//   }
// };
