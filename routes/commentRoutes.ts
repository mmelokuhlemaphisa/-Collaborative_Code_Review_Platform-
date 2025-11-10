import { Router } from "express";
import {
  addComment,
  getCommentsBySubmission,
  getAllComments,
  getCommentById,
  getMyComments,
  updateComment,
  deleteComment,
  getCommentsByLine,
} from "../controllers/commentController";
import { authenticate, authorize } from "../middleware/auth";
import {
  validateComment,
  validateCommentUpdate,
} from "../middleware/validation";

const router = Router();

// All comment routes require authentication
router.use(authenticate);

// Comment routes
router.get("/", getAllComments);
router.get("/my-comments", getMyComments);
router.get("/:id", getCommentById);
router.put("/:id", validateCommentUpdate, updateComment);
router.delete("/:id", deleteComment);

export default router;
