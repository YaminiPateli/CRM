import pool from '../../database/config.js';
import bcrypt from 'bcrypt';

export const updateProfile = async (req, res) => {
  const { name, phone, role } = req.body;
  const userId = req.user.id;
  const profilePhoto = req.file;

  if (!name || !phone || !role) {
    return res.status(400).json({ error: 'Name, phone, and role are required' });
  }

  try {
    // ✅ Fetch current profile photo from DB
    const currentUser = await pool.query(
      'SELECT profile_photo FROM users WHERE id = $1',
      [userId]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingPhoto = currentUser.rows[0].profile_photo;

    // ✅ Use existing photo if none is uploaded
    const profilePhotoPath = profilePhoto
      ? `User Profile Photo/${profilePhoto.originalname}`
      : existingPhoto;

    const updateResult = await pool.query(
      `UPDATE users 
       SET name = $1, phone = $2, role = $3, profile_photo = $4, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $5 AND deleted_at IS NULL 
       RETURNING *`,
      [name, phone, role, profilePhotoPath, userId]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Role update logic
    const roleCheck = await pool.query('SELECT 1 FROM user_roles WHERE user_id = $1', [userId]);
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

    res.status(200).json({
      message: 'Profile updated successfully',
      updatedUser: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

