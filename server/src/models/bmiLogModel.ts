import mongoose, { Schema } from "mongoose";

export interface IBMILog extends Document {
  userId: string;
  weightCm: number;
  heightCm: number;
  category: "over weight" | "under weight" | "normal" | "obese";
  bmi: number;
  createdAt: Date;
}

const BMILogSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    weightCm: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    category: {
      type: String,
      enum: ["over weight", "under weight", "normal", "obese"],
      required: true,
    },
    bmi: { type: Number, required: true },
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
  { timestamps: true }
);

export const BMILog = mongoose.model<IBMILog>("bmilog", BMILogSchema);
