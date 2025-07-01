
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
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:8080',
  'http://192.168.1.57:8080', // add your LAN IP
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/', utilsRoutes);
app.use('/api', userRoutes);


// Start server
app.listen(port, () => {
  console.log(`Real Estate CRM API server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Database test: http://localhost:${port}/test-db`);
});

export { app as default };
