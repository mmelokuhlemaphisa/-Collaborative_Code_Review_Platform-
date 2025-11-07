import { query } from "../config/database";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: "reviewer" | "submitter";
  profile_picture?: string;
}

export class UserModel {
  // Create a new user
  static async create(user: Omit<User, "id">): Promise<User> {
    const { name, email, password, role, profile_picture } = user;
    const result = await query(
      `INSERT INTO users (name, email, password, role, profile_picture) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, email, password, role, profile_picture || null]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    const result = await query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0] || null;
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0] || null;
  }

  // Get all users
  static async findAll(): Promise<User[]> {
    const result = await query(`SELECT * FROM users ORDER BY id`);
    return result.rows;
  }

  // Get users by role
  static async findByRole(role: "reviewer" | "submitter"): Promise<User[]> {
    const result = await query(
      `SELECT * FROM users WHERE role = $1 ORDER BY id`,
      [role]
    );
    return result.rows;
  }

  // Update user
  static async update(
    id: number,
    updates: Partial<Omit<User, "id">>
  ): Promise<User | null> {
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
      `UPDATE users SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  // Delete user
  static async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM users WHERE id = $1`, [id]);
    return (result.rowCount || 0) > 0;
  }

  // Check if email exists
  static async emailExists(email: string): Promise<boolean> {
    const result = await query(
      `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`,
      [email]
    );
    return result.rows[0].exists;
  }
}
