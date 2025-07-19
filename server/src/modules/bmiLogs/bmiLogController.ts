import { Request, Response } from "express";
import { TGetAllBmiLogsQueryParams } from "../../types/bmiLogTypes";
import * as bmiLogService from "./bmiLogService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import messages from "./bmiLogMessage";
import { CustomRequest } from "../../types";

export const getBmiLogs = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const queryParams: TGetAllBmiLogsQueryParams = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      searchCategory: req.query.searchCategory as string,
    };

    const result = await bmiLogService.getBmiLogs(userId, queryParams);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      result,
      messages.GET_BMI_LOGS_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const getBmiLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const bmiLog = await bmiLogService.getBmiLogById(id, userId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      bmiLog,
      messages.GET_BMI_LOG_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const createBmiLog = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const bmiLog = await bmiLogService.createBmiLog(req.body, userId);
    sendSuccessResponse(
      StatusCodes.CREATED,
      req,
      res,
      bmiLog,
      messages.CREATE_BMI_LOG_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const updateBmiLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const bmiLog = await bmiLogService.updateBmiLog(id, req.body, userId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      bmiLog,
      messages.UPDATE_BMI_LOG_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const deleteBmiLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    await bmiLogService.deleteBmiLog(id, userId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      {},
      messages.DELETE_BMI_LOG_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};
