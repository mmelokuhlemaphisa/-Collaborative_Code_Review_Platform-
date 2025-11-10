import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  getMyProjects,
  getProjectsByMember,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectMembers,
} from "../controllers/projectController";
import { getSubmissionsByProject } from "../controllers/submitionController";
import { authenticate } from "../middleware/auth";
import {
  validateProject,
  validateProjectUpdate,
} from "../middleware/validation";

const router = Router();

// All project routes require authentication
router.use(authenticate);

// Project CRUD routes
router.post("/", validateProject, createProject);
router.get("/", getAllProjects);
router.get("/my-projects", getMyProjects);
router.get("/my-memberships", getProjectsByMember);
router.get("/:id", getProjectById);
router.put("/:id", validateProjectUpdate, updateProject);
router.delete("/:id", deleteProject);

// Member management routes
router.get("/:id/members", getProjectMembers);
router.post("/:id/members", addMember);
router.delete("/:id/members/:userId", removeMember);

// Submissions for a project
router.get("/:id/submissions", getSubmissionsByProject);

export default router;
