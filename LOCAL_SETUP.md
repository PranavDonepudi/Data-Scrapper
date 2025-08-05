# Local Development Setup for VS Code

This guide will help you run DataScraper Pro locally on your machine using VS Code.

## Prerequisites

### Required Software
1. **Node.js** (version 20 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **PostgreSQL** (version 14 or higher)
   - **Option A**: Install locally from https://postgresql.org/download/
   - **Option B**: Use Docker: `docker run --name postgres-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres`
   - **Option C**: Use cloud service like Neon, Supabase, or Railway

3. **Git**
   - Download from: https://git-scm.com/
   - Verify: `git --version`

4. **VS Code**
   - Download from: https://code.visualstudio.com/

### Recommended VS Code Extensions
- **TypeScript and JavaScript Language Features** (built-in)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **PostgreSQL** (for database management)
- **Thunder Client** (for API testing)

## Step-by-Step Setup

### 1. Clone the Repository
```bash
# Clone from your GitHub repository
git clone https://github.com/yourusername/datascraper-pro.git
cd datascraper-pro

# Or if working from Replit, download the project files
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# This will install both frontend and backend dependencies including:
# - React, TypeScript, Vite, Tailwind CSS
# - Express.js, Drizzle ORM, Puppeteer
# - All UI components and utilities
```

### 3. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create a new database
createdb datascraper_pro

# Or using psql
psql -U postgres
CREATE DATABASE datascraper_pro;
\q
```

#### Option B: Cloud Database (Recommended)
1. Sign up for [Neon](https://neon.tech) (free tier available)
2. Create a new database
3. Copy the connection string

### 4. Environment Configuration
```bash
# Create environment file
cp .env.example .env

# Edit .env file with your database connection
```

**Required .env variables:**
```env
# Database connection (replace with your actual values)
DATABASE_URL="postgresql://username:password@localhost:5432/datascraper_pro"

# Or for Neon cloud database:
DATABASE_URL="postgresql://username:password@hostname.neon.tech/dbname?sslmode=require"

# Optional: Custom port (defaults to 5000)
PORT=5000

# Development environment
NODE_ENV=development
```

### 5. Database Schema Setup
```bash
# Push database schema to your PostgreSQL database
npm run db:push

# Optional: Open Drizzle Studio to view your database
npm run db:studio
```

### 6. Install System Dependencies for Web Scraping

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser
```

#### macOS:
```bash
# Chromium will be automatically downloaded by Puppeteer
# No additional installation needed
```

#### Windows:
```bash
# Chromium will be automatically downloaded by Puppeteer
# No additional installation needed
```

## Running the Application

### Development Mode
```bash
# Start both frontend and backend in development mode
npm run dev

# This command will:
# - Start Express server on port 5000  
# - Start Vite dev server for React frontend
# - Enable hot module replacement
# - Show compilation errors in real-time
```

### Individual Services
```bash
# Start only the backend server
cd server && npm run dev

# Start only the frontend (in separate terminal)
cd client && npm run dev
```

## VS Code Configuration

### 1. Open Project in VS Code
```bash
# Open the project directory
code .
```

### 2. Recommended Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### 3. Launch Configuration
Create `.vscode/launch.json` for debugging:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/cjs"]
    }
  ]
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start full application
npm run build        # Build for production
npm run preview      # Preview production build

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio database viewer
npm run db:generate  # Generate migration files

# Code Quality
npm run lint         # Run TypeScript checker
npm run type-check   # Check TypeScript types
```

## Testing the Application

### 1. Verify Server is Running
- Open http://localhost:5000 in your browser
- You should see the DataScraper Pro dashboard

### 2. Test Web Scraping
1. Navigate to "Web Scraping" section
2. Create a test scraper with URL: `https://quotes.toscrape.com/`
3. Add selectors:
   - `title`: `title`
   - `quotes`: `.quote .text`
   - `authors`: `.quote .author`
4. Test the scraper to verify it works

### 3. Test API Endpoints
```bash
# Test stats endpoint
curl http://localhost:5000/api/stats

# Test scrapers endpoint
curl http://localhost:5000/api/scrapers
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5000
sudo lsof -t -i tcp:5000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

#### Database Connection Issues
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Test connection
psql -h localhost -U username -d datascraper_pro
```

#### Puppeteer/Chromium Issues
```bash
# Install dependencies on Linux
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo-gobject2 libdrm2 libgtk-3-0 libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6

# Force Puppeteer to download Chromium
npm install puppeteer --force
```

#### TypeScript Errors
```bash
# Clear TypeScript cache
npx tsc --build --clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

### 1. Making Changes
- Edit files in VS Code with full IntelliSense support
- Hot reload automatically updates the browser
- Check terminal for any compilation errors

### 2. Database Changes
- Modify `shared/schema.ts` for schema changes
- Run `npm run db:push` to apply changes
- Use Drizzle Studio to inspect database

### 3. Adding New Features
- Frontend: Add pages in `client/src/pages/`
- Backend: Add routes in `server/routes.ts`
- Shared: Update types in `shared/schema.ts`

## Production Build

### Local Production Test
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL="your_production_database_url"
PORT=5000
```

## Additional Resources

- **React Documentation**: https://react.dev/
- **Drizzle ORM**: https://orm.drizzle.team/
- **Tailwind CSS**: https://tailwindcss.com/
- **Puppeteer**: https://pptr.dev/
- **Express.js**: https://expressjs.com/

---

**Need Help?** 
- Check the main README.md for project overview
- Open an issue on GitHub for bugs
- Review the API documentation at http://localhost:5000/api-docs