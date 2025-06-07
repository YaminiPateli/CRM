
const { Pool } = require('pg');
require('dotenv').config({ path: './api/.env' });

console.log('Database configuration:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PORT:', process.env.DB_PORT);

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'real_estate_crm',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Connection pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting to a new client
});

// Test connection
pool.on('connect', (client) => {
  console.log('New client connected to PostgreSQL database');
});

pool.on('error', (err, client) => {
  console.error('PostgreSQL connection error:', err);
  process.exit(-1);
});

// Test the connection immediately
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database');
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        console.error('Error executing query', err.stack);
      } else {
        console.log('Database query test successful:', result.rows[0]);
      }
    });
  }
});

module.exports = pool;
