import { ERoles } from "../constants";

export type TCreateUserBody = {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: string;
};

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: ERoles;
  age: string;
  gender: string;
};

export type TUserLoginBody = {
  email: string;
  password: string;
};
