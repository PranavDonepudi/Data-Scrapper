# Overview

DataScraper Pro is a comprehensive full-stack web application designed for data collection and management. The application provides tools for web scraping, social media monitoring, data export, API integration, and task scheduling. Built with a modern React frontend and Express.js backend, it enables users to configure scrapers, monitor data collection activities, and integrate with external systems through RESTful APIs.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with comprehensive route handling
- **Error Handling**: Centralized error middleware with status code management
- **Logging**: Custom request/response logging with performance metrics

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema generation
- **Data Models**: Users, scrapers, scraped data, schedules, exports, and social media posts

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Model**: Role-based access with product manager default role
- **Security**: Password hashing and secure session configuration

## Core Services
- **Scraper Service**: Puppeteer-based web scraping with Cheerio for HTML parsing
- **Scheduler Service**: Cron-based task scheduling with node-cron
- **Export Service**: Data export functionality supporting multiple formats
- **Storage Service**: Abstracted database operations with comprehensive CRUD methods

## Development Tools
- **Build System**: Vite for frontend bundling and esbuild for backend compilation
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Development Experience**: Hot module replacement and runtime error overlays
- **Path Aliases**: Organized import structure with @/ prefix for client code

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket connections
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

## Web Scraping Infrastructure
- **Puppeteer**: Headless Chrome automation for dynamic content scraping
- **Cheerio**: Server-side jQuery implementation for HTML parsing
- **WebSocket**: Real-time communication support via ws package

## UI and Design System
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Comprehensive icon library for consistent iconography
- **Recharts**: Chart library for data visualization and analytics

## Development and Build Tools
- **Vite**: Frontend build tool with plugin ecosystem
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Static type checking and enhanced developer experience
- **PostCSS**: CSS processing with Autoprefixer support

## API and Integration
- **Express.js**: Web framework for RESTful API development
- **CORS**: Cross-origin resource sharing configuration
- **TanStack Query**: Client-side data fetching and caching
- **Date-fns**: Date manipulation and formatting utilities

## Scheduling and Automation
- **Node-cron**: Cron job scheduling for automated tasks
- **Nanoid**: Secure URL-friendly unique ID generation
- **Class Variance Authority**: Type-safe CSS class composition