import { Request, Response } from "express";
import { ReviewModel } from "../models/reviewModel";
import { SubmissionModel } from "../models/submitModel";
import { ProjectModel } from "../models/projectModels";

// Approve a submission
export const approveSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }

    const submissionId = parseInt(req.params.id);
    const { comment } = req.body;

    if (isNaN(submissionId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid submission ID" });
      return;
    }

    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    const project = await ProjectModel.findById(submission.project_id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const isCreator = project.created_by === req.user.id;
    const isReviewer = req.user.role === "reviewer";

    if (!isCreator && !isReviewer) {
      res
        .status(403)
        .json({
          success: false,
          message: "Only project creator or reviewers can approve submissions",
        });
      return;
    }

    // create review
    const review = await ReviewModel.create({
      submission_id: submissionId,
      reviewer_id: req.user.id,
      decision: "approved",
      comment: comment || "",
    });

    // update submission status to approved
    const updated = await SubmissionModel.updateStatus(
      submissionId,
      "approved"
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Submission approved",
        data: { review, submission: updated },
      });
  } catch (error) {
    console.error("Approve submission error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to approve submission" });
  }
};

// Request changes for a submission
export const requestChanges = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
      return;
    }

    const submissionId = parseInt(req.params.id);
    const { comment } = req.body;

    if (isNaN(submissionId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid submission ID" });
      return;
    }

    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    const project = await ProjectModel.findById(submission.project_id);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const isCreator = project.created_by === req.user.id;
    const isReviewer = req.user.role === "reviewer";

    if (!isCreator && !isReviewer) {
      res
        .status(403)
        .json({
          success: false,
          message: "Only project creator or reviewers can request changes",
        });
      return;
    }

    // create review record with decision changes_requested
    const review = await ReviewModel.create({
      submission_id: submissionId,
      reviewer_id: req.user.id,
      decision: "changes_requested",
      comment: comment || "",
    });

    // update submission status to under_review
    const updated = await SubmissionModel.updateStatus(
      submissionId,
      "under_review"
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Requested changes for submission",
        data: { review, submission: updated },
      });
  } catch (error) {
    console.error("Request changes error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to request changes" });
  }
};

// Get review history for a submission
export const getReviewsForSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);

    if (isNaN(submissionId)) {
      res
        .status(400)
        .json({ success: false, message: "Invalid submission ID" });
      return;
    }

    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({ success: false, message: "Submission not found" });
      return;
    }

    const reviews = await ReviewModel.findBySubmissionWithReviewer(
      submissionId
    );

    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Failed to get reviews" });
  }
};
