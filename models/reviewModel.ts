import { query } from "../config/database";

export interface Review {
  id?: number;
  submission_id: number;
  reviewer_id: number | null;
  decision: "approved" | "changes_requested";
  comment: string;
  created_at?: Date;
}

export class ReviewModel {
  // Create a new review
  static async create(
    review: Omit<Review, "id" | "created_at">
  ): Promise<Review> {
    const { submission_id, reviewer_id, decision, comment } = review;
    const result = await query(
      `INSERT INTO reviews (submission_id, reviewer_id, decision, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [submission_id, reviewer_id, decision, comment]
    );
    return result.rows[0];
  }

  // Find review by ID
  static async findById(id: number): Promise<Review | null> {
    const result = await query(`SELECT * FROM reviews WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Get all reviews
  static async findAll(): Promise<Review[]> {
    const result = await query(
      `SELECT * FROM reviews ORDER BY created_at DESC`
    );
    return result.rows;
  }

  // Get reviews by submission
  static async findBySubmission(submissionId: number): Promise<Review[]> {
    const result = await query(
      `SELECT * FROM reviews WHERE submission_id = $1 ORDER BY created_at DESC`,
      [submissionId]
    );
    return result.rows;
  }

  // Get reviews by submission with reviewer details
  static async findBySubmissionWithReviewer(
    submissionId: number
  ): Promise<any[]> {
    const result = await query(
      `SELECT r.*, u.name as reviewer_name, u.email as reviewer_email, u.profile_picture
       FROM reviews r
       LEFT JOIN users u ON r.reviewer_id = u.id
       WHERE r.submission_id = $1
       ORDER BY r.created_at DESC`,
      [submissionId]
    );
    return result.rows;
  }

  // Get reviews by reviewer
  static async findByReviewer(reviewerId: number): Promise<Review[]> {
    const result = await query(
      `SELECT * FROM reviews WHERE reviewer_id = $1 ORDER BY created_at DESC`,
      [reviewerId]
    );
    return result.rows;
  }

  // Get reviews by decision
  static async findByDecision(
    decision: "approved" | "changes_requested"
  ): Promise<Review[]> {
    const result = await query(
      `SELECT * FROM reviews WHERE decision = $1 ORDER BY created_at DESC`,
      [decision]
    );
    return result.rows;
  }

  // Get reviews by submission and decision
  static async findBySubmissionAndDecision(
    submissionId: number,
    decision: "approved" | "changes_requested"
  ): Promise<Review[]> {
    const result = await query(
      `SELECT * FROM reviews WHERE submission_id = $1 AND decision = $2 ORDER BY created_at DESC`,
      [submissionId, decision]
    );
    return result.rows;
  }

  // Get review with full details (submission, reviewer)
  static async findByIdWithDetails(id: number): Promise<any | null> {
    const result = await query(
      `SELECT r.*, 
              u.name as reviewer_name, u.email as reviewer_email, u.profile_picture,
              s.code, s.status as submission_status, s.project_id
       FROM reviews r
       LEFT JOIN users u ON r.reviewer_id = u.id
       INNER JOIN submissions s ON r.submission_id = s.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Update review
  static async update(
    id: number,
    updates: Partial<Omit<Review, "id" | "created_at">>
  ): Promise<Review | null> {
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
      `UPDATE reviews SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Update review decision
  static async updateDecision(
    id: number,
    decision: "approved" | "changes_requested"
  ): Promise<Review | null> {
    const result = await query(
      `UPDATE reviews SET decision = $1 WHERE id = $2 RETURNING *`,
      [decision, id]
    );
    return result.rows[0] || null;
  }

  // Delete review
  static async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM reviews WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  // Delete all reviews for a submission (cascade is automatic, but useful for manual cleanup)
  static async deleteBySubmission(submissionId: number): Promise<boolean> {
    const result = await query(`DELETE FROM reviews WHERE submission_id = $1`, [
      submissionId,
    ]);
    return (result.rowCount || 0) > 0;
  }

  // Get review count for a submission
  static async countBySubmission(submissionId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM reviews WHERE submission_id = $1`,
      [submissionId]
    );
    return parseInt(result.rows[0].count);
  }

  // Get review count by reviewer
  static async countByReviewer(reviewerId: number): Promise<number> {
    const result = await query(
      `SELECT COUNT(*) as count FROM reviews WHERE reviewer_id = $1`,
      [reviewerId]
    );
    return parseInt(result.rows[0].count);
  }

  // Get review count by decision
  static async countByDecision(
    decision: "approved" | "changes_requested"
  ): Promise<{ decision: string; count: number }> {
    const result = await query(
      `SELECT decision, COUNT(*) as count FROM reviews WHERE decision = $1 GROUP BY decision`,
      [decision]
    );
    return result.rows[0] || { decision, count: 0 };
  }

  // Get latest review for a submission
  static async getLatestBySubmission(
    submissionId: number
  ): Promise<Review | null> {
    const result = await query(
      `SELECT * FROM reviews WHERE submission_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [submissionId]
    );
    return result.rows[0] || null;
  }

  // Check if submission has been reviewed by a specific reviewer
  static async hasReviewedBy(
    submissionId: number,
    reviewerId: number
  ): Promise<boolean> {
    const result = await query(
      `SELECT EXISTS(SELECT 1 FROM reviews WHERE submission_id = $1 AND reviewer_id = $2)`,
      [submissionId, reviewerId]
    );
    return result.rows[0].exists;
  }

  // Get review statistics for a reviewer
  static async getReviewerStats(reviewerId: number): Promise<any> {
    const result = await query(
      `SELECT 
        COUNT(*) as total_reviews,
        COUNT(CASE WHEN decision = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN decision = 'changes_requested' THEN 1 END) as changes_requested_count
       FROM reviews 
       WHERE reviewer_id = $1`,
      [reviewerId]
    );
    return result.rows[0];
  }

  // Get recent reviews with submission and reviewer details
  static async getRecentWithDetails(limit: number = 10): Promise<any[]> {
    const result = await query(
      `SELECT r.*, 
              u.name as reviewer_name, u.profile_picture,
              s.project_id, p.name as project_name
       FROM reviews r
       LEFT JOIN users u ON r.reviewer_id = u.id
       INNER JOIN submissions s ON r.submission_id = s.id
       INNER JOIN projects p ON s.project_id = p.id
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
