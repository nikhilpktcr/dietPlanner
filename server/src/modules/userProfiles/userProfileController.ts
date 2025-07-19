import { Request, Response } from "express";
import {
  TCreateUserProfileBody,
  TUpdateUserProfileBody,
} from "../../types/userProfileTypes";
import * as userProfileService from "./userProfileService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import messages from "./userProfileMessage";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const body: TCreateUserProfileBody = req.body;
    const profile = await userProfileService.createProfile(body);
    sendSuccessResponse(
      StatusCodes.CREATED,
      req,
      res,
      profile,
      messages.CREATE_PROFILE_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateBody: TUpdateUserProfileBody = req.body;
    const profile = await userProfileService.updateProfile(userId, updateBody);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      profile,
      messages.UPDATE_PROFILE_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const profile = await userProfileService.getProfile(userId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      profile,
      messages.GET_PROFILE_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.NOT_FOUND, req, res, {}, errorMessage);
  }
};
