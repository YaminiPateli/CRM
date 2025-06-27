import express from 'express';
import pool from '../../database/config.js';
import { authenticateToken } from '../middleware/auth.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// GET all users
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create user
router.post('/users', async (req, res) => {
  const { name, email, phone, role, status } = req.body;
  if (!name || !email || !phone || !role || typeof status === 'undefined') {
    return res.status(400).json({ error: 'All fields are required: name, email, phone, role, status' });
  }
  try {
    const defaultPassword = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);
    const isActive = status === 'true' || status === true; // Convert string to boolean

    const result = await pool.query(
      'INSERT INTO users (name, email, phone, role, is_active, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, role, isActive, hashedPassword]
    );
    await pool.query(
      'INSERT INTO user_roles (user_id, role, assigned_by, assigned_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [result.rows[0].id, role, 'system']
    );
    console.log(`Default password for ${email}: ${defaultPassword}`); // Log for now
    res.status(201).json({ ...result.rows[0], password: undefined }); // Exclude password from response
  } catch (error) {
    console.error('❌ Database error:', error);
    if (error.code === '23505') {
      res.status(400).json({ error: 'A user with this email already exists.' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// PUT change password
router.put('/users/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.query(
      'UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update profile (for current user)
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, phone, role } = req.body;
  const userId = req.user.id;

  console.log('Profile update request:', { userId, name, phone, role }); // Debug log

  if (!name || !phone || !role) {
    return res.status(400).json({ error: 'Name, phone, and role are required' });
  }

  try {
    // Update the users table
    const updateResult = await pool.query(
      'UPDATE users SET name = $1, phone = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, phone, role, userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check and update user_roles table
    const roleCheck = await pool.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1',
      [userId]
    );
    if (roleCheck.rowCount === 0) {
      await pool.query(
        'INSERT INTO user_roles (user_id, role, assigned_by, assigned_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [userId, role, 'self']
      );
    } else {
      await pool.query(
        'UPDATE user_roles SET role = $1, assigned_by = $2, assigned_at = CURRENT_TIMESTAMP WHERE user_id = $3',
        [role, 'self', userId]
      );
    }

    console.log('Profile updated successfully for userId:', userId); // Debug log
    res.status(200).json({ message: 'Profile updated successfully', updatedUser: updateResult.rows[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Invalid role value' });
    } else if (error.code === '22P02') { // Invalid input syntax
      res.status(400).json({ error: 'Invalid data format' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// PUT update user (for admin)
router.put('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;
  if (!name || !email || !phone || !role || typeof status === 'undefined') {
    return res.status(400).json({ error: 'Name, email, phone, role, and status are required' });
  }
  try {
    const userResult = await pool.query(
      'SELECT role FROM user_roles WHERE user_id = $1',
      [id]
    );
    const currentRole = userResult.rows[0]?.role;
    const isAdmin = req.user.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can edit this user' });
    }

    const isActive = status === 'true' || status === true; // Convert string to boolean
    await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3, role = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6',
      [name, email, phone, role, isActive, id]
    );

    const roleCheck = await pool.query(
      'SELECT 1 FROM user_roles WHERE user_id = $1',
      [id]
    );
    if (roleCheck.rowCount === 0) {
      await pool.query(
        'INSERT INTO user_roles (user_id, role, assigned_by, assigned_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [id, role, 'admin']
      );
    } else {
      await pool.query(
        'UPDATE user_roles SET role = $1, assigned_by = $2, assigned_at = CURRENT_TIMESTAMP WHERE user_id = $3',
        [role, 'admin', id]
      );
    }

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;