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
import { authenticate } from "../middleware/auth";
import {
  validateSubmission,
  validateSubmissionStatus,
  validateSubmissionUpdate,
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

export default router;
