import mongoose, { Schema } from "mongoose";

export interface IMeal extends Document {
  title: string;
  type: "veg" | "non veg";
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  mealInGrams: number;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: "weightLoss" | "weightGain" | "maintenance";
  ingredients: string[];
  status: "active" | "in active" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["veg", "non veg"], required: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks"],
      required: true,
    },
    mealInGrams: { type: Number, required: true },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    tags: {
      type: String,
      enum: ["weightLoss", "weightGain", "maintenance"],
      required: true,
    },
    ingredients: { type: [String], required: true },
    status: {
      type: String,
      enum: ["active", "in active", "deleted"],
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

export const Meal = mongoose.model<IMeal>("meal", MealSchema);
