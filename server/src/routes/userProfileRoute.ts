import { Router } from "express";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "../modules/userProfiles/userProfileController";
import { authorize } from "../middleware/auth";
import { ERoles } from "../constants";

const router = Router();

// Create user profile
router.post("/create", createProfile);

// Update user profile
router.put("/update/:userId", updateProfile);

// Get user profile
router.get("/get/:userId", getProfile);

router.get("/getAll/", getProfile);

export default router;
