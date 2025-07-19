import { env } from "../config/envConfig";

export default {
  DB_CONNECT_SUCESS: "💾 database connected successfully ✅",
  DB_CONNECT_FAILED: "❌ database failed connect",
};

export enum EUncaughtExceptionMessages {
  uncaughtException = "uncaughtException",
  uncaughtExceptionMessage = "💥 Uncaught Exception",
}

export enum EUnhandledRejectionMessages {
  unhandledRejection = "unhandledRejection",
  unhandledRejectionMessage = "💥 Uncaught Rejection",
}

export enum EServerStartMessages {
  serverRunning = "🚀 Server is running at http://localhost:",
  serverStarted = "ℹ️  Server started",
}
