import mongoose, { Schema, Types } from "mongoose";

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  heightCm: number;
  weightCm: number;
  dietaryPreferences: "veg" | "non veg";
  allergies: string[];
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very active";
  healthGoals: "weightLoss" | "weightGain" | "maintenance";
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

const UserProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    heightCm: { type: Number, required: true },
    weightCm: { type: Number, required: true },
    dietaryPreferences: {
      type: String,
      enum: ["veg", "non veg"],
      required: true,
    },
    allergies: { type: [String], required: true },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very active"],
      required: true,
    },
    healthGoals: {
      type: String,
      enum: ["weightLoss", "weightGain", "maintenance"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "user",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const UserProfile = mongoose.model<IUserProfile>(
  "userProfile",
  UserProfileSchema
);
