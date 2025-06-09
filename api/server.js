
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import pool from '../database/config.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

console.log('Starting Real Estate CRM API Server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', port);
console.log('Frontend URL:', process.env.FRONTEND_URL);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Real Estate CRM API is running',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Database connection test endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    res.json({
      status: 'success',
      message: 'Database connection successful',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Contacts/Leads API
app.get('/api/leads', authenticateToken, async (req, res) => {
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
app.post('/api/leads', authenticateToken, async (req, res) => {
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

// Projects API
app.get('/api/projects', authenticateToken, async (req, res) => {
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
app.post('/api/projects', authenticateToken, async (req, res) => {
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

// Start server
app.listen(port, () => {
  console.log(`Real Estate CRM API server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Database test: http://localhost:${port}/api/test-db`);
});

export { app as default };
