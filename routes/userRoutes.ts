import { Router } from "express";
import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getUsersByRole,
} from "../controllers/userController";
import { authenticate, checkOwnership } from "../middleware/auth";
import { validateUserUpdate } from "../middleware/validation";

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get all users
router.get("/", getAllUsers);

// Get users by role
router.get("/role/:role", getUsersByRole);

// Get user by ID
router.get("/:id", getUserById);

// Update user (only own profile)
router.put("/:id", checkOwnership("id"), validateUserUpdate, updateUser);

// Delete user (only own profile)
router.delete("/:id", checkOwnership("id"), deleteUser);

export default router;
