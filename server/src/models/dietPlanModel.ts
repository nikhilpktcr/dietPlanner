import mongoose, { Schema } from "mongoose";

export interface IDietPlan extends Document {
  userId: mongoose.Types.ObjectId;
  daily: mongoose.Types.ObjectId[];
  weekly: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DietPlanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    daily: [{ type: Schema.Types.ObjectId, required: true, ref: "Meal" }],
    weekly: [{ type: Schema.Types.ObjectId, required: true, ref: "Meal" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
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

export const DietPlan = mongoose.model<IDietPlan>("DietPlan", DietPlanSchema);
