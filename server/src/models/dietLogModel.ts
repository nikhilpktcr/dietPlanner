import mongoose, { Schema } from "mongoose";

export interface IDietLog extends Document {
  userId: mongoose.Types.ObjectId;
  dietPlanId: mongoose.Types.ObjectId;
  mealId: mongoose.Types.ObjectId;
  date: Date;
  status: "taken" | "skipped" | "partial";
  loggedAt: Date;
  comments: string;
}

const DietLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    dietPlanId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "dietPlan",
    },
    mealId: { type: Schema.Types.ObjectId, required: true, ref: "meal" },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["taken", "skipped", "partial"],
      required: true,
    },
    loggedAt: { type: Date, required: true },
    comments: { type: String, required: true },
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

export const DietLog = mongoose.model<IDietLog>("dietLog", DietLogSchema);
