
# Local PostgreSQL Setup Guide

## Prerequisites

1. **Install PostgreSQL**
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)

## Step-by-Step Setup

### 1. Clone/Setup Project
```bash
# If you haven't already, make sure you're in the project directory
cd your-project-directory
```

### 2. Database Setup

#### Create Database
```bash
# Connect to PostgreSQL (you may need to provide password)
createdb real_estate_crm

# Or manually:
psql -U postgres
CREATE DATABASE real_estate_crm;
\q
```

#### Run Schema
```bash
# Apply the database schema
psql -U postgres -d real_estate_crm -f database/schema.sql
```

### 3. API Configuration

#### Update Environment File
Edit `api/.env` and update with your PostgreSQL credentials:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=real_estate_crm
DB_PASSWORD=your_actual_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-very-secure-secret-key-change-in-production

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Install API Dependencies
```bash
cd api
npm install express pg cors bcrypt jsonwebtoken dotenv
```

### 4. Start the Services

#### Terminal 1 - Start API Server
```bash
cd api
npm start
# or
node server.js
```

You should see:
```
Connected to PostgreSQL database
Real Estate CRM API server running on port 3001
```

#### Terminal 2 - Start Frontend
```bash
# In the main project directory
npm run dev
```

### 5. Test the Connection

1. **Test API Health**: Visit `http://localhost:3001/health`
2. **Test Database**: Visit `http://localhost:3001/api/test-db`
3. **Test Frontend**: Visit `http://localhost:5173`

### 6. Login with Demo Accounts

- **Admin**: admin@demo.com / admin123
- **Manager**: manager@demo.com / admin123
- **Agent**: agent@demo.com / admin123

## Troubleshooting

### Common Issues

1. **Connection refused to PostgreSQL**
   - Make sure PostgreSQL service is running
   - Check if the port 5432 is correct
   - Verify username and password in `.env`

2. **Database does not exist**
   ```bash
   createdb real_estate_crm
   ```

3. **Permission denied**
   - Make sure your PostgreSQL user has necessary permissions
   - Try connecting as superuser first

4. **API server not starting**
   - Check if port 3001 is available
   - Verify all dependencies are installed
   - Check the `.env` file configuration

### Useful Commands

```bash
# Check PostgreSQL status
sudo service postgresql status  # Linux
brew services list | grep postgresql  # macOS

# Connect to database
psql -U postgres -d real_estate_crm

# View tables
\dt

# View users
SELECT * FROM users;

# Reset database (if needed)
psql -U postgres -d real_estate_crm -f database/schema.sql
```

## Directory Structure

```
project/
├── api/
│   ├── .env                 # Your database configuration
│   ├── server.js           # Main API server
│   ├── auth.js             # Authentication routes
│   └── package.json        # API dependencies
├── database/
│   ├── config.js           # Database connection
│   └── schema.sql          # Database schema
└── src/
    └── contexts/
        └── AuthContext.tsx  # Frontend auth context
```

## Next Steps

Once everything is running:
1. Test login functionality
2. Create some leads and contacts
3. Add properties and projects
4. Set up follow-ups
5. Generate reports

The system is now fully connected to your local PostgreSQL database!
