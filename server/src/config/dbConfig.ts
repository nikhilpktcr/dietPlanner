import mongoose from "mongoose";
import { env } from "./envConfig";
import messages from "../messages";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.DB_CONNECTION, {
      dbName: env.DB_NAME,
    });
    console.log(`${env.DB_NAME} ${messages.DB_CONNECT_SUCESS}`);
  } catch (error) {
    console.error(`${env.DB_NAME} ${messages.DB_CONNECT_FAILED}`, error);
    process.exit(1);
  }
};

export default connectDB;
