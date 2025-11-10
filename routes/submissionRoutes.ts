import { Router } from "express";
import {
  createSubmission,
  getAllSubmissions,
  getSubmissionsByProject,
  getSubmissionById,
  getMySubmissions,
  getSubmissionsByStatus,
  updateSubmissionStatus,
  updateSubmission,
  deleteSubmission,
} from "../controllers/submitionController";
import {
  addComment,
  getCommentsBySubmission,
  getCommentsByLine,
} from "../controllers/commentController";
import { authenticate } from "../middleware/auth";
import {
  validateSubmission,
  validateSubmissionStatus,
  validateSubmissionUpdate,
  validateComment,
} from "../middleware/validation";

const router = Router();

// All submission routes require authentication
router.use(authenticate);

// Submission CRUD routes
router.post("/", validateSubmission, createSubmission);
router.get("/", getAllSubmissions);
router.get("/my-submissions", getMySubmissions);
router.get("/status/:status", getSubmissionsByStatus);
router.get("/:id", getSubmissionById);
router.put("/:id", validateSubmissionUpdate, updateSubmission);
router.delete("/:id", deleteSubmission);

// Status update route
router.patch("/:id/status", validateSubmissionStatus, updateSubmissionStatus);

// Comment routes for submissions
router.post("/:id/comments", validateComment, addComment);
router.get("/:id/comments", getCommentsBySubmission);
router.get("/:id/comments/line/:lineNumber", getCommentsByLine);

export default router;
