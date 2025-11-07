import { query } from "../config/database";

export interface Comment {
  id?: number;
  submission_id: number;
  reviewer_id: number;
  line_number: number;
  content: string;
  created_at?: Date;
}

export class CommentModel {
  // Create a new comment
  static async create(
    comment: Omit<Comment, "id" | "created_at">
  ): Promise<Comment> {
    const { submission_id, reviewer_id, line_number, content } = comment;
    const result = await query(
      `INSERT INTO comments (submission_id, reviewer_id, line_number, content) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [submission_id, reviewer_id, line_number, content]
    );
    return result.rows[0];
  }

  // Find comment by ID
  static async findById(id: number): Promise<Comment | null> {
    const result = await query(`SELECT * FROM comments WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Get all comments
  static async findAll(): Promise<Comment[]> {
    const result = await query(
      `SELECT * FROM comments ORDER BY created_at DESC`
    );
    return result.rows;
  }

  // Get comments by submission
  static async findBySubmission(submissionId: number): Promise<Comment[]> {
    const result = await query(
      `SELECT * FROM comments WHERE submission_id = $1 ORDER BY line_number, created_at`,
      [submissionId]
    );
    return result.rows;
  }

  // Get comments by submission with reviewer details
  static async findBySubmissionWithReviewer(
    submissionId: number
  ): Promise<any[]> {
    const result = await query(
      `SELECT c.*, u.name as reviewer_name, u.email as reviewer_email, u.profile_picture
       FROM comments c
       INNER JOIN users u ON c.reviewer_id = u.id
       WHERE c.submission_id = $1
       ORDER BY c.line_number, c.created_at`,
      [submissionId]
    );
    return result.rows;
  }

  // Get comments by reviewer
  static async findByReviewer(reviewerId: number): Promise<Comment[]> {
    const result = await query(
      `SELECT * FROM comments WHERE reviewer_id = $1 ORDER BY created_at DESC`,
      [reviewerId]
    );
    return result.rows;
  }

  // Get comments by line number
  static async findByLine(
    submissionId: number,
    lineNumber: number
  ): Promise<Comment[]> {
    const result = await query(
      `SELECT * FROM comments WHERE submission_id = $1 AND line_number = $2 ORDER BY created_at`,
      [submissionId, lineNumber]
    );
    return result.rows;
  }

  // Update comment
  static async update(
    id: number,
    updates: Partial<Omit<Comment, "id" | "created_at">>
  ): Promise<Comment | null> {
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
      `UPDATE comments SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Delete comment
  static async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM comments WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  // Delete all comments for a submission
  static async deleteBySubmission(submissionId: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM comments WHERE submission_id = $1`,
      [submissionId]
    );
    return (result.rowCount || 0) > 0;
  }

  // Get comment count for a submission
  static async countBySubmission(submissionId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM comments WHERE submission_id = $1`,
      [submissionId]
    );
    return parseInt(result.rows[0].count);
  }

  // Get comment count by reviewer
  static async countByReviewer(reviewerId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM comments WHERE reviewer_id = $1`,
      [reviewerId]
    );
    return parseInt(result.rows[0].count);
  }

  // Get recent comments for a submission
  static async getRecentBySubmission(
    submissionId: number,
    limit: number = 10
  ): Promise<any[]> {
    const result = await query(
      `SELECT c.*, u.name as reviewer_name, u.profile_picture
       FROM comments c
       INNER JOIN users u ON c.reviewer_id = u.id
       WHERE c.submission_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2`,
      [submissionId, limit]
    );
    return result.rows;
  }
}
