import { query } from "../config/database";

export interface Submission {
  id?: number;
  project_id: number;
  user_id: number;
  code: string;
  status: "pending" | "approved" | "rejected" | "under_review";
}

export class SubmissionModel {
  // Create a new submission
  static async create(submission: Omit<Submission, "id">): Promise<Submission> {
    const { project_id, user_id, code, status } = submission;
    const result = await query(
      `INSERT INTO submissions (project_id, user_id, code, status) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [project_id, user_id, code, status || "pending"]
    );
    return result.rows[0];
  }

  // Find submission by ID
  static async findById(id: number): Promise<Submission | null> {
    const result = await query(`SELECT * FROM submissions WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Get all submissions
  static async findAll(): Promise<Submission[]> {
    const result = await query(`SELECT * FROM submissions ORDER BY id`);
    return result.rows;
  }

  // Get submissions by project
  static async findByProject(projectId: number): Promise<Submission[]> {
    const result = await query(
      `SELECT * FROM submissions WHERE project_id = $1 ORDER BY id`,
      [projectId]
    );
    return result.rows;
  }

  // Get submissions by user
  static async findByUser(userId: number): Promise<Submission[]> {
    const result = await query(
      `SELECT * FROM submissions WHERE user_id = $1 ORDER BY id`,
      [userId]
    );
    return result.rows;
  }

  // Get submissions by status
  static async findByStatus(status: string): Promise<Submission[]> {
    const result = await query(
      `SELECT * FROM submissions WHERE status = $1 ORDER BY id`,
      [status]
    );
    return result.rows;
  }

  // Get submissions by project and status
  static async findByProjectAndStatus(
    projectId: number,
    status: string
  ): Promise<Submission[]> {
    const result = await query(
      `SELECT * FROM submissions WHERE project_id = $1 AND status = $2 ORDER BY id`,
      [projectId, status]
    );
    return result.rows;
  }

  // Get submission with user details
  static async findByIdWithUser(id: number): Promise<any | null> {
    const result = await query(
      `SELECT s.*, u.name as user_name, u.email as user_email 
       FROM submissions s
       INNER JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Update submission
  static async update(
    id: number,
    updates: Partial<Omit<Submission, "id">>
  ): Promise<Submission | null> {
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
      `UPDATE submissions SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Update submission status
  static async updateStatus(
    id: number,
    status: string
  ): Promise<Submission | null> {
    const result = await query(
      `UPDATE submissions SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] || null;
  }

  // Delete submission
  static async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM submissions WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  // Get submission count by project
  static async countByProject(projectId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM submissions WHERE project_id = $1`,
      [projectId]
    );
    return parseInt(result.rows[0].count);
  }

  // Get submission count by user
  static async countByUser(userId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM submissions WHERE user_id = $1`,
      [userId]
    );
    return parseInt(result.rows[0].count);
  }
}
