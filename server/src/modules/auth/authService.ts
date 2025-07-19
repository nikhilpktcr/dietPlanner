import bcrypt from "bcryptjs";
import { TCreateUserBody, TUserLoginBody } from "../../types/userTypes";
import { generateJWT } from "../../utils/authFunction";
import UserModel from "../../models/userModel";
import { ERoles } from "../../constants";

export const register = async (createBody: TCreateUserBody) => {
  const { name, email, password, age, gender } = createBody;
  const role = ERoles.User;
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("User already exists");
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    passwordHash,
    role,
    age,
    gender,
  });
  return { name: user.name, email: user.email, role: user.role };
};

export const login = async (
  bodyParams: TUserLoginBody
): Promise<{
  token: string;
  email: string;
  role: ERoles;
  name: string;
  userId: string;
}> => {
  const { email, password } = bodyParams;
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error("Invalid credentials");
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid credentials");
  const generatedToken = await generateJWT(user);
  const response: any = {
    token: generatedToken,
    email: user.email,
    role: user.role,
    name: user.name,
    userId: user._id,
  };
  return response;
};
