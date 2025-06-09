
import express from 'express';
import pool from '../../database/config.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get leads with pagination and filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT c.*, p1.name as project_name, p2.flat_no as property_flat, u.name as agent_name
      FROM contacts c
      LEFT JOIN projects p1 ON c.interested_project_id = p1.id
      LEFT JOIN properties p2 ON c.interested_property_id = p2.id
      LEFT JOIN users u ON c.assigned_agent_id = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (c.name ILIKE $${paramCount} OR c.email ILIKE $${paramCount} OR c.phone ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    // Role-based filtering
    if (req.user.role === 'agent') {
      paramCount++;
      query += ` AND c.assigned_agent_id = $${paramCount}`;
      params.push(req.user.id);
    }

    query += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM contacts c WHERE 1=1';
    const countParams = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (c.name ILIKE $${countParamCount} OR c.email ILIKE $${countParamCount} OR c.phone ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND c.status = $${countParamCount}`;
      countParams.push(status);
    }

    if (req.user.role === 'agent') {
      countParamCount++;
      countQuery += ` AND c.assigned_agent_id = $${countParamCount}`;
      countParams.push(req.user.id);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create lead
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name, email, phone, source, type, interested_project_id,
      interested_property_id, budget, requirements, notes
    } = req.body;

    const result = await pool.query(`
      INSERT INTO contacts (
        name, email, phone, source, type, interested_project_id,
        interested_property_id, budget, requirements, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      name, email, phone, source, type || 'buyer',
      interested_project_id, interested_property_id, budget, requirements, notes
    ]);

    // Log activity
    await pool.query(`
      INSERT INTO lead_activities (contact_id, activity_type, description, performed_by)
      VALUES ($1, 'created', 'Lead created', $2)
    `, [result.rows[0].id, req.user.id]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
