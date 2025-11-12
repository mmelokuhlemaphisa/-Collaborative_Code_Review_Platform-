import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  approveSubmission,
  requestChanges,
  getReviewsForSubmission,
} from "../controllers/reviewController";
import { validateReview } from "../middleware/validation";

const router = Router();

// Approve a submission
router.post(
  "/submissions/:id/approve",
  authenticate,
  validateReview,
  approveSubmission
);

// Request changes
router.post(
  "/submissions/:id/request-changes",
  authenticate,
  validateReview,
  requestChanges
);

// Get reviews for a submission
router.get("/submissions/:id/reviews", authenticate, getReviewsForSubmission);

export default router;
