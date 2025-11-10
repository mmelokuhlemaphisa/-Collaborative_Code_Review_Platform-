import { Request, Response } from "express";
import { SubmissionModel } from "../models/submitModel";
import { ProjectModel } from "../models/projectModels";

// Create a new submission
export const createSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const { project_id, code } = req.body;

    // Check if project exists
    const project = await ProjectModel.findById(project_id);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    // Check if user is a member of the project or creator
    const isMember = await ProjectModel.isMember(project_id, req.user.id);
    const isCreator = project.created_by === req.user.id;

    if (!isMember && !isCreator) {
      res.status(403).json({
        success: false,
        message: "You must be a project member to submit code",
      });
      return;
    }

    const submission = await SubmissionModel.create({
      project_id,
      user_id: req.user.id,
      code,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Submission created successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Create submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create submission",
    });
  }
};

// Get all submissions
export const getAllSubmissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissions = await SubmissionModel.findAll();

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get all submissions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

// Get submissions by project
export const getSubmissionsByProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id);

    if (isNaN(projectId)) {
      res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
      return;
    }

    // Check if project exists
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const submissions = await SubmissionModel.findByProject(projectId);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get submissions by project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

// Get single submission by ID
export const getSubmissionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
      return;
    }

    const submission = await SubmissionModel.findByIdWithUser(submissionId);

    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Get submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submission",
    });
  }
};

// Get submissions by current user
export const getMySubmissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const submissions = await SubmissionModel.findByUser(req.user.id);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get my submissions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

// Get submissions by status
export const getSubmissionsByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.params;

    const validStatuses = ["pending", "approved", "rejected", "under_review"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          "Invalid status. Must be: pending, approved, rejected, or under_review",
      });
      return;
    }

    const submissions = await SubmissionModel.findByStatus(status);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("Get submissions by status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get submissions",
    });
  }
};

// Update submission status
export const updateSubmissionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if submission exists
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    // Check if user has permission (project creator or reviewers)
    const project = await ProjectModel.findById(submission.project_id);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const isCreator = project.created_by === req.user.id;
    const isReviewer = req.user.role === "reviewer";

    if (!isCreator && !isReviewer) {
      res.status(403).json({
        success: false,
        message:
          "Only project creator or reviewers can update submission status",
      });
      return;
    }

    const updatedSubmission = await SubmissionModel.updateStatus(
      submissionId,
      status
    );

    res.status(200).json({
      success: true,
      message: "Submission status updated successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Update submission status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update submission status",
    });
  }
};

// Update submission (code)
export const updateSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if submission exists and user owns it
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    if (submission.user_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "You can only update your own submissions",
      });
      return;
    }

    const { code } = req.body;
    const updates: any = {};
    if (code) updates.code = code;

    const updatedSubmission = await SubmissionModel.update(
      submissionId,
      updates
    );

    res.status(200).json({
      success: true,
      message: "Submission updated successfully",
      data: updatedSubmission,
    });
  } catch (error) {
    console.error("Update submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update submission",
    });
  }
};

// Delete submission
export const deleteSubmission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if submission exists
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    // Check if user owns the submission or is project creator
    const project = await ProjectModel.findById(submission.project_id);
    const isOwner = submission.user_id === req.user.id;
    const isProjectCreator = project?.created_by === req.user.id;

    if (!isOwner && !isProjectCreator) {
      res.status(403).json({
        success: false,
        message:
          "You can only delete your own submissions or if you're the project creator",
      });
      return;
    }

    await SubmissionModel.delete(submissionId);

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (error) {
    console.error("Delete submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete submission",
    });
  }
};
