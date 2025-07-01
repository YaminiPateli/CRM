import pool from '../database/config.js';
import bcrypt from 'bcrypt';

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, phone, role, status } = req.body;

  if (!name || !email || !phone || !role || typeof status === 'undefined') {
    return res.status(400).json({ message: 'All fields are required: name, email, phone, role, status' });
  }

  try {
    const defaultPassword = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    const isActive = status === 'true' || status === true; // Convert string to boolean

    const result = await pool.query(
      `INSERT INTO users (name, email, phone, role, is_active, password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, is_active AS status, created_at, last_login, assigned_leads, converted_leads`,
      [name, email, phone, role, isActive, hashedPassword]
    );
    await pool.query(
      'INSERT INTO user_roles (user_id, role, assigned_by, assigned_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [result.rows[0].id, role, 'system']
    );
    console.log(`Default password for ${email}: ${defaultPassword}`); // Log for now
    res.status(201).json({ ...result.rows[0], password: undefined }); // Exclude password from response
  } catch (err) {
    console.error('Error creating user:', err.message);
    if (err.code === '23505') {
      res.status(400).json({ message: 'A user with this email already exists.' });
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  }
};