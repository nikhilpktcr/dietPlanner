import { body } from "express-validator";
import { validatorFn } from "../middleware/validatorMiddleware";

export const bmiLogValidator = [
  body("weightCm")
    .isFloat({ min: 30, max: 300 })
    .withMessage("Weight must be between 30 and 300 kg"),

  body("heightCm")
    .isFloat({ min: 100, max: 250 })
    .withMessage("Height must be between 100 and 250 cm"),

  validatorFn,
];
