
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
    const {
      name, description, rera_project_id, sales, possession, search_address,
      address, street, country, state, city, zip, locality, latitude, longitude
    } = req.body;

    const result = await pool.query(`
      INSERT INTO projects (
        name, description, rera_project_id, sales, possession, search_address,
        address, street, country, state, city, zip, locality, latitude,
        longitude, created_by
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16
      )
      RETURNING *
    `, [
      name, description, rera_project_id, sales, possession, search_address,
      address, street, country, state, city, zip, locality, latitude,
      longitude, req.user.id
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});


export default router;