import mongoose from "mongoose";
import {
  TCreateMealBody,
  TUpdateMealBody,
  TGetAllMealsQueryParams,
} from "../../types/mealTypes";
import { Meal } from "../../models/mealModel";

export const createMeal = async (
  createBody: TCreateMealBody,
  userId: string
) => {
  const {
    title,
    type,
    mealType,
    mealInGrams,
    description,
    calories,
    protein,
    carbs,
    fats,
    tags,
    ingredients,
    status,
  } = createBody;

  // Check if meal with same title already exists
  const existingMeal = await Meal.findOne({ title });
  if (existingMeal) {
    throw new Error("Meal with this title already exists");
  }

  const meal = await Meal.create({
    title,
    type,
    mealType,
    mealInGrams,
    description,
    calories,
    protein,
    carbs,
    fats,
    tags,
    ingredients,
    status,
    createdBy: userId,
  });

  return meal;
};

export const updateMeal = async (
  mealId: string,
  updateBody: TUpdateMealBody,
  userId: string
) => {
  // Validate mealId format
  if (!mongoose.Types.ObjectId.isValid(mealId)) {
    throw new Error("Invalid meal ID format");
  }

  const existingMeal = await Meal.findById(mealId);
  if (!existingMeal) {
    throw new Error("Meal not found");
  }

  // If title is being updated, check for duplicates
  if (updateBody.title && updateBody.title !== existingMeal.title) {
    const duplicateMeal = await Meal.findOne({ title: updateBody.title });
    if (duplicateMeal) {
      throw new Error("Meal with this title already exists");
    }
  }

  const updatedMeal = await Meal.findByIdAndUpdate(
    mealId,
    {
      ...updateBody,
      updatedBy: userId,
    },
    { new: true, runValidators: true }
  );

  return updatedMeal;
};

export const deleteMeal = async (mealId: string) => {
  // Validate mealId format
  if (!mongoose.Types.ObjectId.isValid(mealId)) {
    throw new Error("Invalid meal ID format");
  }

  const existingMeal = await Meal.findById(mealId);
  if (!existingMeal) {
    throw new Error("Meal not found");
  }

  // Soft delete by setting status to deleted
  const deletedMeal = await Meal.findByIdAndUpdate(
    mealId,
    { status: "deleted" },
    { new: true }
  );

  return deletedMeal;
};

export const getMeal = async (mealId: string) => {
  // Validate mealId format
  if (!mongoose.Types.ObjectId.isValid(mealId)) {
    throw new Error("Invalid meal ID format");
  }

  const meal = await Meal.findById(mealId);
  if (!meal) {
    throw new Error("Meal not found");
  }

  return meal;
};

export const getAllMeals = async (queryParams: TGetAllMealsQueryParams) => {
  const {
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    limit = "10",
    offset = "0",
    mealType,
    type,
    tags,
    status = "active",
  } = queryParams;

  const parseLimit = limit ? parseInt(limit) : 10;
  const parseOffset = offset ? parseInt(offset) : 0;

  const matchStage: any = { status: { $ne: "deleted" } };

  // Add search functionality
  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { ingredients: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Add filters
  if (mealType) {
    matchStage.mealType = mealType;
  }
  if (type) {
    matchStage.type = type;
  }
  if (tags) {
    matchStage.tags = tags;
  }
  if (status) {
    matchStage.status = status;
  }

  const sortStage: any = {};
  sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

  const meals = await Meal.aggregate([
    { $match: matchStage },
    { $sort: sortStage },
    { $skip: parseOffset },
    { $limit: parseLimit },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdByUser",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "updatedBy",
        foreignField: "_id",
        as: "updatedByUser",
      },
    },
    {
      $addFields: {
        createdByUser: { $arrayElemAt: ["$createdByUser", 0] },
        updatedByUser: { $arrayElemAt: ["$updatedByUser", 0] },
      },
    },
  ]);

  return meals;
};

export const getMealsCount = async (queryParams: TGetAllMealsQueryParams) => {
  const { search = "", mealType, type, tags, status = "active" } = queryParams;

  const matchStage: any = { status: { $ne: "deleted" } };

  // Add search functionality
  if (search) {
    matchStage.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { ingredients: { $in: [new RegExp(search, "i")] } },
    ];
  }

  // Add filters
  if (mealType) {
    matchStage.mealType = mealType;
  }
  if (type) {
    matchStage.type = type;
  }
  if (tags) {
    matchStage.tags = tags;
  }
  if (status) {
    matchStage.status = status;
  }

  const count = await Meal.countDocuments(matchStage);
  return count;
};
