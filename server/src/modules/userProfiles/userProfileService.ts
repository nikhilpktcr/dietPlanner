import mongoose from "mongoose";
import {
  TCreateUserProfileBody,
  TUpdateUserProfileBody,
} from "../../types/userProfileTypes";
import { UserProfile } from "../../models/userProfileModel";
import { BMILog } from "../../models/bmiLogModel";

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

// Helper function to create BMI log
const createBMILog = async (
  userId: string,
  weightCm: number,
  heightCm: number
) => {
  const bmi = calculateBMI(weightCm, heightCm);
  const category = getBMICategory(bmi);

  await BMILog.create({
    userId,
    weightCm,
    heightCm,
    category,
    bmi,
    createdBy: userId,
  });
};

export const createProfile = async (createBody: TCreateUserProfileBody) => {
  const {
    userId,
    heightCm,
    weightCm,
    dietaryPreferences,
    allergies,
    activityLevel,
    healthGoals,
  } = createBody;

  // Check if profile already exists for this user
  const existingProfile = await UserProfile.findOne({ userId });
  if (existingProfile) {
    throw new Error("Profile already exists for this user");
  }

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const profile = await UserProfile.create({
    userId,
    heightCm,
    weightCm,
    dietaryPreferences,
    allergies,
    activityLevel,
    healthGoals,
    createdBy: userId,
  });

  // Create BMI log entry
  await createBMILog(userId, weightCm, heightCm);

  return profile;
};

export const updateProfile = async (
  userId: string,
  updateBody: TUpdateUserProfileBody
) => {
  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const existingProfile = await UserProfile.findOne({ userId });
  if (!existingProfile) {
    throw new Error("Profile not found for this user");
  }

  const updatedProfile = await UserProfile.findOneAndUpdate(
    { userId },
    {
      ...updateBody,
      updatedBy: userId,
    },
    { new: true, runValidators: true }
  );

  // Create BMI log entry if height or weight was updated
  if (updateBody.heightCm || updateBody.weightCm) {
    const newHeightCm = updateBody.heightCm || existingProfile.heightCm;
    const newWeightCm = updateBody.weightCm || existingProfile.weightCm;
    await createBMILog(userId, newWeightCm, newHeightCm);
  }

  return updatedProfile;
};

export const getProfile = async (userId: string) => {
  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const profile = await UserProfile.findOne({ userId });
  return profile;
};
