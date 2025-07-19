import * as jwt from "jsonwebtoken";
import { env } from "../config/envConfig";
import { IUser } from "../interfaces/userInterface";

export const generateJWT = async (user: IUser) => {
  // JWT payload containing user information
  const payload = {
    userId: user._id,
    role: user.role,
    email: user.email,
  };
  // Generate and return the JWT
  const token = await jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
  return token;
};
