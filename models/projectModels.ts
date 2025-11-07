import { query } from "../config/database";

export interface Project {
  id?: number;
  name: string;
  description: string;
  created_by: number;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
}

export class ProjectModel {
  // Create a new project
  static async create(project: Omit<Project, "id">): Promise<Project> {
    const { name, description, created_by } = project;
    const result = await query(
      `INSERT INTO projects (name, description, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [name, description, created_by]
    );
    return result.rows[0];
  }

  // Find project by ID
  static async findById(id: number): Promise<Project | null> {
    const result = await query(`SELECT * FROM projects WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Get all projects
  static async findAll(): Promise<Project[]> {
    const result = await query(`SELECT * FROM projects ORDER BY id`);
    return result.rows;
  }

  // Get projects created by a specific user
  static async findByCreator(userId: number): Promise<Project[]> {
    const result = await query(
      `SELECT * FROM projects WHERE created_by = $1 ORDER BY id`,
      [userId]
    );
    return result.rows;
  }

  // Get projects for a member
  static async findByMember(userId: number): Promise<Project[]> {
    const result = await query(
      `SELECT p.* FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1
       ORDER BY p.id`,
      [userId]
    );
    return result.rows;
  }

  // Update project
  static async update(
    id: number,
    updates: Partial<Omit<Project, "id" | "created_by">>
  ): Promise<Project | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query(
      `UPDATE projects SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Delete project
  static async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM projects WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  // Add member to project
  static async addMember(
    projectId: number,
    userId: number
  ): Promise<ProjectMember> {
    const result = await query(
      `INSERT INTO project_members (project_id, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [projectId, userId]
    );
    return result.rows[0];
  }

  // Remove member from project
  static async removeMember(
    projectId: number,
    userId: number
  ): Promise<boolean> {
    const result = await query(
      `DELETE FROM project_members WHERE project_id = $1 AND user_id = $2`,
      [projectId, userId]
    );
    return (result.rowCount || 0) > 0;
  }

  // Get all members of a project
  static async getMembers(projectId: number): Promise<any[]> {
    const result = await query(
      `SELECT u.* FROM users u
       INNER JOIN project_members pm ON u.id = pm.user_id
       WHERE pm.project_id = $1
       ORDER BY u.id`,
      [projectId]
    );
    return result.rows;
  }

  // Check if user is a member of project
  static async isMember(projectId: number, userId: number): Promise<boolean> {
    const result = await query(
      `SELECT EXISTS(SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2)`,
      [projectId, userId]
    );
    return result.rows[0].exists;
  }
}
