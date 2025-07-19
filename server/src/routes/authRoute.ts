import { Router } from "express";
import { register, login } from "../modules/auth/authController";
import { loginValidator, registerValidator } from "../validators/index";

const router = Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);

export default router;
