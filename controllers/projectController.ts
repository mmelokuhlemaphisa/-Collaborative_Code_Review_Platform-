import { Request, Response } from "express";
import { ProjectModel } from "../models/projectModels";

// Create a new project
export const createProject = async (
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

    const { name, description } = req.body;

    const project = await ProjectModel.create({
      name,
      description,
      created_by: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project",
    });
  }
};

// Get all projects
export const getAllProjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await ProjectModel.findAll();

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get all projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// Get project by ID
export const getProjectById = async (
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

    const project = await ProjectModel.findById(projectId);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get project",
    });
  }
};

// Get projects created by current user
export const getMyProjects = async (
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

    const projects = await ProjectModel.findByCreator(req.user.id);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get my projects error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// Get projects where user is a member
export const getProjectsByMember = async (
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

    const projects = await ProjectModel.findByMember(req.user.id);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("Get projects by member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get projects",
    });
  }
};

// Update project
export const updateProject = async (
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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if project exists and user is the creator
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.created_by !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Only project creator can update the project",
      });
      return;
    }

    const { name, description } = req.body;
    const updates: any = {};
    if (name) updates.name = name;
    if (description !== undefined) updates.description = description;

    const updatedProject = await ProjectModel.update(projectId, updates);

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// Delete project
export const deleteProject = async (
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

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if project exists and user is the creator
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.created_by !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Only project creator can delete the project",
      });
      return;
    }

    await ProjectModel.delete(projectId);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};

// Add member to project
export const addMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id);
    const { user_id } = req.body;

    if (isNaN(projectId)) {
      res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
      return;
    }

    if (!user_id) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
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

    // Check if project exists and user is the creator
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.created_by !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Only project creator can add members",
      });
      return;
    }

    // Check if user is already a member
    const isMember = await ProjectModel.isMember(projectId, user_id);
    if (isMember) {
      res.status(409).json({
        success: false,
        message: "User is already a member of this project",
      });
      return;
    }

    await ProjectModel.addMember(projectId, user_id);

    res.status(201).json({
      success: true,
      message: "Member added successfully",
    });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

// Remove member from project
export const removeMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = parseInt(req.params.userId);

    if (isNaN(projectId) || isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid project ID or user ID",
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

    // Check if project exists and user is the creator
    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.created_by !== req.user.id) {
      res.status(403).json({
        success: false,
        message: "Only project creator can remove members",
      });
      return;
    }

    const removed = await ProjectModel.removeMember(projectId, userId);

    if (!removed) {
      res.status(404).json({
        success: false,
        message: "Member not found in project",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};

// Get all members of a project
export const getProjectMembers = async (
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

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    const members = await ProjectModel.getMembers(projectId);

    // Remove passwords from response
    const membersWithoutPasswords = members.map(
      ({ password: _, ...member }) => member
    );

    res.status(200).json({
      success: true,
      count: members.length,
      data: membersWithoutPasswords,
    });
  } catch (error) {
    console.error("Get project members error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get project members",
    });
  }
};
