import { body } from "express-validator";
import { validatorFn } from "../middleware/validatorMiddleware";

export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email").isEmail().withMessage("A valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("age")
    .isInt({ min: 0 })
    .withMessage("Age must be a valid non-negative number"),

  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("role")
    .isIn(["admin", "user"])
    .withMessage("Role must be admin or user"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validatorFn,
];
