import express, { Application, Request } from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/envConfig";
import routes from "./routes";
import helmet from "helmet";
// import { limiterConfig } from "./config/rateLimitConfig";
import connectDB from "./config/dbConfig";
import {
  globalErrorHandler,
  notFoundHandler,
} from "./middleware/errorMiddleware";
import { sendErrorResponse } from "./utils/responseUtil";
import { StatusCodes } from "http-status-codes";
import { requestIdMiddleware } from "./middleware/requestIdMiddleware";

const app: Application = express();

// ===== Middleware =====
// app.use(limiterConfig);
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// ===== Request ID Middleware =====
app.use(requestIdMiddleware);

// ===== Morgan Logging with Request ID =====

morgan.token("id", (req: Request) => {
  const requestId = req.headers["x-request-id"];
  return typeof requestId === "string"
    ? requestId
    : Array.isArray(requestId)
      ? requestId[0]
      : "unknown";
});

app.use(
  morgan(
    "🧾 requestId=:id 🚀 :method :url 📦 status=:status ⏱️ :response-time ms"
  )
);

// ===== API Routes =====
app.use(env.BASIC_API_URL, routes);

// ===== Un handled Routes =====
app.use(notFoundHandler);

// ===== Global Error Handler =====
app.use(globalErrorHandler);

export default app;
