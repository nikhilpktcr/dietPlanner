// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import { TCreateUserBody, TUserLoginBody } from "../../types/userTypes";
// import { generateJWT } from "../../utils/authFunction";
// import { TGetAllQueryParams } from "../../types";
// import UserModel from "../../models/userModel";
// import { ERoles } from "../../constants";

// export const registerUser = async (
//   createBody: TCreateUserBody & { role: string }
// ) => {
//   const { name, email, password, phone, role = "user" } = createBody;
//   const existing = await UserModel.findOne({ email });
//   if (existing) throw new Error("User already exists");
//   const passwordHash = await bcrypt.hash(password, 10);
//   const user = await UserModel.create({
//     name,
//     email,
//     passwordHash,
//     role,
//     phone,
//   });

//   return { name: user.name, email: user.email, role: user.role };
// };

// export const loginUser = async (
//   bodyParams: TUserLoginBody
// ): Promise<{
//   token: string;
//   email: string;
//   role: ERoles;
//   name: string;
//   userId: string;
// }> => {
//   const { email, password } = bodyParams;
//   const user = await UserModel.findOne({ email });
//   if (!user) throw new Error("Invalid credentials");
//   const isMatch = await bcrypt.compare(password, user.passwordHash);
//   if (!isMatch) throw new Error("Invalid credentials");
//   const generatedToken = await generateJWT(user);
//   const response: any = {
//     token: generatedToken,
//     email: user.email,
//     role: user.role,
//     name: user.name,
//     userId: user._id,
//   };
//   return response;
// };

// export const getAllUsers = async (
//   queryParams: TGetAllQueryParams
// ): Promise<any> => {
//   const {
//     search = "",
//     sortBy = "createdAt",
//     sortOrder = "asc",
//     limit = "10",
//     offset = "0",
//   } = queryParams;

//   const parseLimit = limit ? parseInt(limit) : 10;
//   const parseOffset = offset ? parseInt(offset) : 0;

//   const matchStage: any = {};

//   if (search) {
//     matchStage.$or = [
//       { name: { $regex: search, $options: "i" } },
//       { email: { $regex: search, $options: "i" } },
//       { phone: { $regex: search, $options: "i" } },
//     ];
//   }

//   const sortStage: any = {};
//   sortStage[sortBy] = sortOrder === "asc" ? 1 : -1;

//   const users = await UserModel.aggregate([
//     { $match: matchStage },
//     { $sort: sortStage },
//     { $skip: parseOffset },
//     { $limit: parseLimit },
//   ]);

//   return users;
// };
