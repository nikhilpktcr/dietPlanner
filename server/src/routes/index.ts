import { Router } from "express";
import authRoutes from "./authRoute";
import userProfileRoutes from "./userProfileRoute";
import mealRoutes from "./mealRoute";
import bmiLogRoutes from "./bmiLogRoute";
// import userRoutes from "./usersRoute";

const router = Router();

// Versioned routing prefix is added in app.ts using env.BASIC_API_URL
router.use("/auth", authRoutes);
router.use("/user-profiles", userProfileRoutes);
router.use("/meals", mealRoutes);
router.use("/bmi-logs", bmiLogRoutes);
// router.use("/users", userRoutes);

export default router;
