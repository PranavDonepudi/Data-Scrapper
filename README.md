# DataScraper Pro

**A comprehensive data collection and management platform for product managers with powerful API integrations for technical teams.**

DataScraper Pro is a full-stack web application that enables efficient data collection from websites and social media platforms, with robust analytics, automated scheduling, and seamless API access for technical integrations.

---

## 🚀 Features

### **Web Scraping Engine**
- **Multi-Method Scraping**: Puppeteer for JavaScript-heavy sites with automatic HTTP+Cheerio fallback
- **Visual Scraper Builder**: Point-and-click CSS selector configuration
- **Test Before Run**: Validate scrapers with live preview before execution
- **Batch Processing**: Handle multiple pages with configurable delays and concurrency
- **Real-time Monitoring**: Track scraping progress and status updates

### **Social Media Monitoring** 
- **Multi-Platform Support**: Twitter, Facebook, Instagram, LinkedIn data collection
- **Rich Metadata Capture**: Hashtags, mentions, engagement metrics, timestamps
- **Flexible Data Structure**: Handles various post formats and engagement types
- **Historical Tracking**: Maintain complete records of social media activity

### **Analytics Dashboard**
- **Real-time Statistics**: Total records, active scrapers, API usage, success rates
- **Visual Data Trends**: Interactive charts showing collection patterns over time
- **Performance Metrics**: Success rates, response times, error tracking
- **Export Analytics**: Track data export history and usage patterns

### **Data Export System**
- **Multiple Formats**: CSV, JSON, Excel (XLSX), XML export options
- **Bulk Export**: Export large datasets with progress tracking
- **Scheduled Exports**: Automated data exports on custom schedules
- **Download Management**: Secure file storage and retrieval system

### **Task Automation**
- **Flexible Scheduling**: Hourly, daily, weekly, monthly, or custom cron expressions
- **Background Processing**: Non-blocking task execution with status monitoring
- **Pause/Resume Control**: Fine-grained control over scheduled operations
- **Error Handling**: Automatic retry logic and failure notifications

### **API Integration**
- **RESTful API**: Complete API endpoints for all data operations
- **Technical Documentation**: Comprehensive API docs with code examples
- **Authentication Ready**: Built for secure API key integration
- **Rate Limiting**: Production-ready API usage controls

---

## 🛠 Technology Stack

### **Frontend**
- **React 18** with TypeScript and Vite
- **Shadcn/ui** components built on Radix UI primitives
- **Tailwind CSS** for modern styling with dark mode support
- **TanStack Query** for efficient server state management
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation

### **Backend**
- **Node.js** with Express.js framework
- **TypeScript** with ES modules for type safety
- **PostgreSQL** database with Drizzle ORM
- **Neon** serverless PostgreSQL hosting
- **Express Sessions** with secure PostgreSQL session store

### **Scraping & Automation**
- **Puppeteer** for headless Chrome automation
- **Cheerio** for server-side HTML parsing
- **Node-cron** for job scheduling
- **WebSocket** support for real-time updates

### **Data Processing**
- **JSON/JSONB** for flexible data storage
- **CSV/Excel** export with proper formatting
- **Date-fns** for date manipulation
- **Nanoid** for secure ID generation

---

## 📋 Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** database (Neon recommended)
- **Chromium/Chrome** for web scraping (auto-installed)

---

## 🚀 Quick Start

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/datascraper-pro.git
cd datascraper-pro
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create a `.env` file with your database connection:
```env
DATABASE_URL="postgresql://username:password@hostname:port/database"
```

### **4. Database Setup**
```bash
# Push schema to database
npm run db:push

# Optional: View database in Drizzle Studio
npm run db:studio
```

### **5. Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

---

## 💡 Usage Guide

### **Creating Your First Scraper**
1. Navigate to **Web Scraping** → **Create Scraper**
2. Enter target URL (e.g., `https://quotes.toscrape.com/`)
3. Configure CSS selectors:
   - `title`: `title` - Page title
   - `quotes`: `.quote .text` - Quote text
   - `authors`: `.quote .author` - Author names
4. **Test Scraper** to preview results
5. **Run Scraper** to collect data

### **Setting Up Automated Tasks**
1. Go to **Scheduled Tasks** → **Create Schedule**
2. Select your scraper from the dropdown
3. Choose frequency (hourly, daily, weekly, monthly)
4. Set next run time
5. **Activate** the schedule

### **Exporting Data**
1. Visit **Data Export** section
2. Choose data source (scraped data, social media posts)
3. Select format (CSV, JSON, Excel, XML)
4. Click **Generate Export**
5. Download when processing completes

### **API Integration**
1. Navigate to **API Integration**
2. Copy endpoint URLs and authentication details
3. Use provided code examples for your preferred language
4. Test endpoints using the interactive documentation

---

## 🔌 API Reference

### **Core Endpoints**

#### **Scraped Data**
```http
GET /api/scraped-data?limit=100&scraperId=optional
POST /api/scrapers
PUT /api/scrapers/{id}
DELETE /api/scrapers/{id}
```

#### **Social Media**
```http
GET /api/social-media-posts?platform=twitter&limit=100
POST /api/social-media-posts
```

#### **Analytics**
```http
GET /api/stats
GET /api/exports
POST /api/exports
```

#### **Scheduling**
```http
GET /api/schedules
POST /api/schedules
PUT /api/schedules/{id}
DELETE /api/schedules/{id}
POST /api/schedules/{id}/pause
POST /api/schedules/{id}/resume
```

### **Example Usage**

#### **JavaScript/Node.js**
```javascript
// Fetch scraped data
const response = await fetch('/api/scraped-data', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

#### **Python**
```python
import requests

# Create new scraper
scraper_config = {
    "name": "Product Scraper",
    "url": "https://example.com",
    "selectors": {
        "title": "h1.product-title",
        "price": ".price"
    },
    "delay": 2,
    "maxPages": 100
}

response = requests.post(
    'http://localhost:5000/api/scrapers',
    json=scraper_config,
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

print(response.json())
```

#### **cURL**
```bash
# Get social media posts
curl -X GET "http://localhost:5000/api/social-media-posts?platform=twitter&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

---

## 📊 Database Schema

### **Core Tables**
- **users** - User accounts and authentication
- **scrapers** - Scraper configurations and settings
- **scraped_data** - Collected web scraping results
- **social_media_posts** - Social media monitoring data
- **schedules** - Automated task scheduling
- **exports** - Data export history and files

### **Key Relationships**
- Users own multiple scrapers and schedules
- Scrapers generate scraped_data records
- Schedules link to specific scrapers
- Exports can reference any data source

---

## 🔧 Development

### **Project Structure**
```
datascraper-pro/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and config
├── server/                 # Express backend
│   ├── services/           # Business logic services
│   ├── db.ts              # Database connection
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data access layer
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema & types
└── exports/               # Generated export files
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
npm run lint         # Run TypeScript checks
```

### **Adding New Features**
1. **Database Changes**: Update `shared/schema.ts`
2. **API Routes**: Add endpoints to `server/routes.ts`
3. **Frontend Pages**: Create in `client/src/pages/`
4. **UI Components**: Use shadcn/ui components from `@/components/ui/`

---

## 🚀 Deployment

### **Replit Deployment** (Recommended)
1. Push code to GitHub repository
2. Import to Replit from GitHub
3. Configure environment variables
4. Deploy using Replit's one-click deployment

### **Manual Deployment**
1. Build the application: `npm run build`
2. Configure PostgreSQL database
3. Set environment variables
4. Start production server: `npm start`

### **Environment Variables**
```env
DATABASE_URL=postgresql://...     # PostgreSQL connection string
NODE_ENV=production              # Production environment
PORT=5000                        # Server port (optional)
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/datascraper-pro/issues)
- **Documentation**: [API Docs](http://localhost:5000/api-docs)
- **Community**: [Discussions](https://github.com/yourusername/datascraper-pro/discussions)

---

## 🙏 Acknowledgments

- Built with [Replit](https://replit.com) development platform
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database ORM by [Drizzle](https://orm.drizzle.team)
- Hosting by [Neon](https://neon.tech) PostgreSQL

---

**Made with ❤️ for Product Managers and Technical Teams**