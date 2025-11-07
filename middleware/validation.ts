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

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
