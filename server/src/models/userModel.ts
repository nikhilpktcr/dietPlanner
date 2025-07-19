import mongoose, { Schema, Document, Types } from "mongoose";
import { EGender, EStatus } from "../constants/user";
import { ERoles } from "../constants";
import { IUser } from "../interfaces/userInterface";

// Mongoose Schema
const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: Object.values(EGender),
      required: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(ERoles),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EStatus),
      default: EStatus.Active,
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

export default mongoose.model<IUser>("user", UserSchema);
