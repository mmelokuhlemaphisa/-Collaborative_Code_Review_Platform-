import { Router } from "express";
import { register, login, getCurrentUser } from "../controllers/authController";
import { authenticate } from "../middleware/auth";
import { validateRegistration, validateLogin } from "../middleware/validation";

const router = Router();

// Public routes
router.post("/register", validateRegistration, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/current", authenticate, getCurrentUser);

export default router;
