
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './auth.js';
import leadsRoutes from './routes/leads.js';
import projectsRoutes from './routes/projects.js';
import utilsRoutes from './routes/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/', utilsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Real Estate CRM API server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Database test: http://localhost:${port}/test-db`);
});

export { app as default };
