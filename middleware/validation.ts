import { Request, Response, NextFunction } from "express";

// Validate registration input
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, password, role } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!role || !["reviewer", "submitter"].includes(role)) {
    errors.push("Role must be either 'reviewer' or 'submitter'");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate login input
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  const errors: string[] = [];

  if (!email || !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate user update
export const validateUserUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email, role } = req.body;

  const errors: string[] = [];

  if (name !== undefined && name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (email !== undefined && !isValidEmail(email)) {
    errors.push("Valid email is required");
  }

  if (role !== undefined && !["reviewer", "submitter"].includes(role)) {
    errors.push("Role must be either 'reviewer' or 'submitter'");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate project creation
export const validateProject = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description } = req.body;

  const errors: string[] = [];

  if (!name || name.trim().length < 3) {
    errors.push("Project name must be at least 3 characters long");
  }

  if (name && name.length > 100) {
    errors.push("Project name must not exceed 100 characters");
  }

  if (!description || description.trim().length < 10) {
    errors.push("Project description must be at least 10 characters long");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate project update
export const validateProjectUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description } = req.body;

  const errors: string[] = [];

  if (name !== undefined && name.trim().length < 3) {
    errors.push("Project name must be at least 3 characters long");
  }

  if (name !== undefined && name.length > 100) {
    errors.push("Project name must not exceed 100 characters");
  }

  if (description !== undefined && description.trim().length < 10) {
    errors.push("Project description must be at least 10 characters long");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate submission creation
export const validateSubmission = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { project_id, code } = req.body;

  const errors: string[] = [];

  if (!project_id || isNaN(parseInt(project_id))) {
    errors.push("Valid project ID is required");
  }

  if (!code || code.trim().length < 10) {
    errors.push("Code must be at least 10 characters long");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate submission status update
export const validateSubmissionStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status } = req.body;

  const errors: string[] = [];
  const validStatuses = ["pending", "approved", "rejected", "under_review"];

  if (!status) {
    errors.push("Status is required");
  } else if (!validStatuses.includes(status)) {
    errors.push("Status must be: pending, approved, rejected, or under_review");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate submission update (code)
export const validateSubmissionUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code } = req.body;

  const errors: string[] = [];

  if (code !== undefined && code.trim().length < 10) {
    errors.push("Code must be at least 10 characters long");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate comment creation
export const validateComment = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { line_number, content } = req.body;

  const errors: string[] = [];

  if (line_number === undefined || isNaN(parseInt(line_number))) {
    errors.push("Valid line number is required");
  }

  if (line_number !== undefined && parseInt(line_number) < 1) {
    errors.push("Line number must be at least 1");
  }

  if (!content || content.trim().length < 1) {
    errors.push("Comment content is required");
  }

  if (content && content.length > 1000) {
    errors.push("Comment content must not exceed 1000 characters");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Validate comment update
export const validateCommentUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { line_number, content } = req.body;

  const errors: string[] = [];

  if (line_number !== undefined && isNaN(parseInt(line_number))) {
    errors.push("Line number must be a valid number");
  }

  if (line_number !== undefined && parseInt(line_number) < 1) {
    errors.push("Line number must be at least 1");
  }

  if (content !== undefined && content.trim().length < 1) {
    errors.push("Comment content cannot be empty");
  }

  if (content !== undefined && content.length > 1000) {
    errors.push("Comment content must not exceed 1000 characters");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate review (comment length etc.)
export const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { comment } = req.body;

  const errors: string[] = [];

  if (comment !== undefined && typeof comment !== "string") {
    errors.push("Comment must be a string");
  }

  if (comment !== undefined && comment.length > 1000) {
    errors.push("Comment must not exceed 1000 characters");
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
    return;
  }

  next();
};
