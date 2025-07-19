import { Router } from "express";
import {
  getBmiLogs,
  getBmiLogById,
  createBmiLog,
  updateBmiLog,
  deleteBmiLog,
} from "../modules/bmiLogs/bmiLogController";
import { authorize } from "../middleware/auth";
import { ERoles } from "../constants";
import { bmiLogValidator } from "../validators/bmiLogValidators";

const router = Router();

// All routes require user authentication
router.use(authorize(ERoles.User));

// Get all BMI logs with pagination and filtering
router.get("/", getBmiLogs);

// Get specific BMI log by ID
router.get("/:id", getBmiLogById);

// Create new BMI log
router.post("/", bmiLogValidator, createBmiLog);

// Update BMI log
router.put("/:id", bmiLogValidator, updateBmiLog);

// Delete BMI log
router.delete("/:id", deleteBmiLog);

export default router;
