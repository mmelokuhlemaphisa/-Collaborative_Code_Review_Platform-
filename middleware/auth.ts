import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: "reviewer" | "submitter";
      };
    }
  }
}

// Authenticate JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: "No token provided. Access denied.",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Verify token
    const decoded = jwt.verify(token, secret) as {
      id: number;
      email: string;
      role: "reviewer" | "submitter";
    };

    // Attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid token. Access denied.",
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

// Authorize based on role
export const authorize = (...roles: Array<"reviewer" | "submitter">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient permissions.",
      });
      return;
    }

    next();
  };
};

// Check if user owns resource or is admin
export const checkOwnership = (userIdParam: string = "id") => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
      return;
    }

    const resourceUserId = parseInt(req.params[userIdParam]);

    if (req.user.id !== resourceUserId) {
      res.status(403).json({
        success: false,
        message: "Access forbidden. You can only access your own resources.",
      });
      return;
    }

    next();
  };
};
