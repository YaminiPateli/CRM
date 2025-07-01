
import express from 'express';
import pool from '../../database/config.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get projects
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        COUNT(pr.id) as total_properties,
        COUNT(CASE WHEN pr.status = 'sold' THEN 1 END) as sold_properties
      FROM projects p
      LEFT JOIN properties pr ON p.id = pr.project_id
      WHERE p.is_active = true
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    res.json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create project
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.user.role === 'agent') {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { name, description, location, type, start_date, end_date, total_units } = req.body;

    const result = await pool.query(`
      INSERT INTO projects (name, description, location, type, start_date, end_date, total_units, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, description, location, type || 'residential', start_date, end_date, total_units, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
