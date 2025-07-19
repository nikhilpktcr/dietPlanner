import { Request, Response } from "express";
import {
  TCreateMealBody,
  TUpdateMealBody,
  TGetAllMealsQueryParams,
} from "../../types/mealTypes";
import * as mealService from "./mealService";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import messages from "./mealMessage";
import { CustomRequest } from "../../types";

export const createMeal = async (req: Request, res: Response) => {
  try {
    const body: TCreateMealBody = req.body;
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const meal = await mealService.createMeal(body, userId);
    sendSuccessResponse(
      StatusCodes.CREATED,
      req,
      res,
      meal,
      messages.CREATE_MEAL_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const updateMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const updateBody: TUpdateMealBody = req.body;
    const { userId } = (req as unknown as CustomRequest).user;
    if (!userId) {
      throw new Error("User ID not found in request");
    }

    const meal = await mealService.updateMeal(mealId, updateBody, userId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      meal,
      messages.UPDATE_MEAL_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const meal = await mealService.deleteMeal(mealId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      meal,
      messages.DELETE_MEAL_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.BAD_REQUEST, req, res, {}, errorMessage);
  }
};

export const getMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const meal = await mealService.getMeal(mealId);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      meal,
      messages.GET_MEAL_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(StatusCodes.NOT_FOUND, req, res, {}, errorMessage);
  }
};

export const getAllMeals = async (req: Request, res: Response) => {
  try {
    const queryParams: TGetAllMealsQueryParams =
      req.query as TGetAllMealsQueryParams;
    const meals = await mealService.getAllMeals(queryParams);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      meals,
      messages.GET_ALL_MEALS_SUCCESS
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      req,
      res,
      {},
      errorMessage
    );
  }
};

export const getMealsCount = async (req: Request, res: Response) => {
  try {
    const queryParams: TGetAllMealsQueryParams =
      req.query as TGetAllMealsQueryParams;
    const count = await mealService.getMealsCount(queryParams);
    sendSuccessResponse(
      StatusCodes.OK,
      req,
      res,
      { count },
      "Meals count fetched successfully"
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    sendErrorResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      req,
      res,
      {},
      errorMessage
    );
  }
};
