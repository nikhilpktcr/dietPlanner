import { Router } from "express";
import {
  createMeal,
  updateMeal,
  deleteMeal,
  getMeal,
  getAllMeals,
  getMealsCount,
} from "../modules/meals/mealController";
import { authorize } from "../middleware/auth";
import { ERoles } from "../constants";

const router = Router();

router.post("/create", authorize(ERoles.Admin), createMeal);

router.put("/update/:mealId", authorize(ERoles.Admin), updateMeal);

router.delete(
  "/delete/:mealId",
  authorize(ERoles.Admin, ERoles.User),
  deleteMeal
);

// Get single meal
router.get("/get/:mealId", authorize(ERoles.Admin, ERoles.User), getMeal);

// Get all meals with filtering and pagination
router.get("/getAll", authorize(ERoles.Admin, ERoles.User), getAllMeals);

// Get meals count
router.get("/count", authorize(ERoles.Admin, ERoles.User), getMealsCount);

export default router;
