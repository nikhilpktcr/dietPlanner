import mongoose from "mongoose";
import { BMILog } from "../../models/bmiLogModel";
import {
  TCreateBmiLogBody,
  TUpdateBmiLogBody,
  TGetAllBmiLogsQueryParams,
} from "../../types/bmiLogTypes";

// Helper function to calculate BMI
const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightInMeters = heightCm / 100;
  return Number((weightKg / (heightInMeters * heightInMeters)).toFixed(1));
};

// Helper function to get BMI category
const getBMICategory = (
  bmi: number
): "over-weight" | "under-weight" | "normal" | "obese" => {
  if (bmi < 18.5) return "under-weight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "over-weight";
  return "obese";
};

export const getBmiLogs = async (
  userId: string,
  queryParams: TGetAllBmiLogsQueryParams
) => {
  const { page = 1, limit = 10, searchCategory } = queryParams;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = { userId };
  if (searchCategory) {
    filter.category = searchCategory;
  }

  // Get total count
  const total = await BMILog.countDocuments(filter);

  // Get logs with pagination
  const logs = await BMILog.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    logs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBmiLogById = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid BMI log ID format");
  }

  const bmiLog = await BMILog.findOne({ _id: id, userId });
  if (!bmiLog) {
    throw new Error("BMI log not found");
  }

  return bmiLog;
};

export const createBmiLog = async (
  createBody: TCreateBmiLogBody,
  userId: string
) => {
  const { weightCm, heightCm } = createBody;

  // Calculate BMI and category
  const bmi = calculateBMI(weightCm, heightCm);
  const category = getBMICategory(bmi);

  const bmiLog = await BMILog.create({
    userId,
    weightCm,
    heightCm,
    category,
    bmi,
    createdBy: userId,
  });

  return bmiLog;
};

export const updateBmiLog = async (
  id: string,
  updateBody: TUpdateBmiLogBody,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid BMI log ID format");
  }

  const existingBmiLog = await BMILog.findOne({ _id: id, userId });
  if (!existingBmiLog) {
    throw new Error("BMI log not found");
  }

  // If height or weight is being updated, recalculate BMI
  let updateData = { ...updateBody, updatedBy: userId };
  if (updateBody.heightCm || updateBody.weightCm) {
    const newWeightCm = updateBody.weightCm || existingBmiLog.weightCm;
    const newHeightCm = updateBody.heightCm || existingBmiLog.heightCm;
    const newBmi = calculateBMI(newWeightCm, newHeightCm);
    const newCategory = getBMICategory(newBmi);
    updateData = {
      ...updateData,
      bmi: newBmi,
      category: newCategory,
    };
  }

  const updatedBmiLog = await BMILog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedBmiLog;
};

export const deleteBmiLog = async (id: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid BMI log ID format");
  }

  const bmiLog = await BMILog.findOneAndDelete({ _id: id, userId });
  if (!bmiLog) {
    throw new Error("BMI log not found");
  }

  return bmiLog;
};
