import { Request, Response } from "express";
import { CommentModel } from "../models/commentsModels";
import { SubmissionModel } from "../models/submitModel";

// Add comment to submission
export const addComment = async (
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

    const submissionId = parseInt(req.params.id);
    const { line_number, content } = req.body;

    if (isNaN(submissionId)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID",
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

    // Only reviewers can comment (or project creators)
    if (req.user.role !== "reviewer") {
      res.status(403).json({
        success: false,
        message: "Only reviewers can add comments",
      });
      return;
    }

    const comment = await CommentModel.create({
      submission_id: submissionId,
      reviewer_id: req.user.id,
      line_number,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};

// Get comments for a submission
export const getCommentsBySubmission = async (
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

    // Check if submission exists
    const submission = await SubmissionModel.findById(submissionId);
    if (!submission) {
      res.status(404).json({
        success: false,
        message: "Submission not found",
      });
      return;
    }

    const comments = await CommentModel.findBySubmissionWithReviewer(
      submissionId
    );

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comments",
    });
  }
};

// Get all comments (admin/review purposes)
export const getAllComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comments = await CommentModel.findAll();

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get all comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comments",
    });
  }
};

// Get comment by ID
export const getCommentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid comment ID",
      });
      return;
    }

    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("Get comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comment",
    });
  }
};

// Get comments by current reviewer
export const getMyComments = async (
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

    const comments = await CommentModel.findByReviewer(req.user.id);

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get my comments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comments",
    });
  }
};

// Update comment
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid comment ID",
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

    // Check if comment exists and user owns it
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
      });
      return;
    }

    if (comment.reviewer_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "You can only update your own comments",
      });
      return;
    }

    const { line_number, content } = req.body;
    const updates: any = {};
    if (line_number !== undefined) updates.line_number = line_number;
    if (content) updates.content = content;

    const updatedComment = await CommentModel.update(commentId, updates);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Update comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update comment",
    });
  }
};

// Delete comment
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid comment ID",
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

    // Check if comment exists
    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      res.status(404).json({
        success: false,
        message: "Comment not found",
      });
      return;
    }

    // Only comment owner can delete
    if (comment.reviewer_id !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
      return;
    }

    await CommentModel.delete(commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

// Get comments by line number (for a specific submission)
export const getCommentsByLine = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionId = parseInt(req.params.id);
    const lineNumber = parseInt(req.params.lineNumber);

    if (isNaN(submissionId) || isNaN(lineNumber)) {
      res.status(400).json({
        success: false,
        message: "Invalid submission ID or line number",
      });
      return;
    }

    const comments = await CommentModel.findByLine(submissionId, lineNumber);

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error("Get comments by line error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get comments",
    });
  }
};
