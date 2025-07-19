import { Types } from "mongoose";
import { ERoles } from "../constants";
import { EGender, EStatus } from "../constants/user";

export interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  age: number;
  gender: EGender;
  passwordHash: string;
  role: ERoles;
  status: EStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | Types.ObjectId;
  updatedBy?: string | Types.ObjectId;
}
