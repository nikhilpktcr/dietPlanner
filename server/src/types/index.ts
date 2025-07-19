import { Types } from "mongoose";
import { ERoles } from "../constants";
export interface CustomRequest extends Request, JwtPayload {}

export type TGetAllQueryParams = {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  limit?: string;
  offset?: string;
};

export type TGetOnePathParams = {
  id: string | Types.ObjectId;
};

export interface JwtPayload {
  user: {
    userId: string;
    role: ERoles;
  };
}
