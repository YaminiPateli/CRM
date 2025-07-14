// File: api/controllers/project.controller.js
import pool from '../../database/config.js';

export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
        COUNT(pr.id) AS total_properties,
        COUNT(CASE WHEN pr.status = 'sold' THEN 1 END) AS sold_properties
      FROM projects p
      LEFT JOIN properties pr ON p.id = pr.project_id
      WHERE p.deleted_at IS NULL
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProject = async (req, res) => {
  const {
    name, description, rera_project_id, sales, possession, search_address,
    address, street, country, state, city, zip, locality, latitude, longitude,
    created_by, is_active
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO projects (
        name, description, rera_project_id, sales, possession, search_address,
        address, street, country, state, city, zip, locality, latitude,
        longitude, created_by, is_active
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17
      ) RETURNING *
    `, [
      name, description, rera_project_id, sales, possession, search_address,
      address, street, country, state, city, zip, locality, latitude,
      longitude, created_by, is_active
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const {
    name, description, rera_project_id, sales, possession, search_address,
    address, street, country, state, city, zip, locality, latitude, longitude,
    is_active
  } = req.body;

  try {
    // Ensure is_active is treated as a boolean
    const activeValue = is_active === 'true' || is_active === true ? true : false;

    const result = await pool.query(`
      UPDATE projects SET
        name=$1, description=$2, rera_project_id=$3, sales=$4, possession=$5,
        search_address=$6, address=$7, street=$8, country=$9, state=$10,
        city=$11, zip=$12, locality=$13, latitude=$14, longitude=$15,
        is_active=$16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id=$17 AND deleted_at IS NULL
      RETURNING *
    `, [
      name, description, rera_project_id, sales, possession, search_address,
      address, street, country, state, city, zip, locality, latitude,
      longitude, activeValue, id
    ]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Deleting project with ID: ${id}`);

    const result = await pool.query(`
      UPDATE projects SET
        deleted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING id, name, deleted_at
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or already deleted' });
    }

    res.json({
      message: 'Project soft-deleted successfully',
      project: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to soft-delete project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};