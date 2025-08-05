import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { scraperService } from "./services/scraper";
import { schedulerService } from "./services/scheduler";
import { 
  insertScraperSchema, 
  insertScheduleSchema, 
  insertExportSchema,
  insertSocialMediaPostSchema 
} from "@shared/schema";
import fs from 'fs/promises';
import path from 'path';

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize scheduler
  await schedulerService.initializeSchedules();

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Scrapers endpoints
  app.get("/api/scrapers", async (req, res) => {
    try {
      const scrapers = await storage.getScrapers();
      res.json(scrapers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scrapers" });
    }
  });

  app.get("/api/scrapers/:id", async (req, res) => {
    try {
      const scraper = await storage.getScraper(req.params.id);
      if (!scraper) {
        return res.status(404).json({ error: "Scraper not found" });
      }
      res.json(scraper);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scraper" });
    }
  });

  app.post("/api/scrapers", async (req, res) => {
    try {
      const validatedData = insertScraperSchema.parse(req.body);
      const scraper = await storage.createScraper(validatedData);
      res.status(201).json(scraper);
    } catch (error) {
      res.status(400).json({ error: "Invalid scraper data" });
    }
  });

  app.put("/api/scrapers/:id", async (req, res) => {
    try {
      const updates = insertScraperSchema.partial().parse(req.body);
      const scraper = await storage.updateScraper(req.params.id, updates);
      res.json(scraper);
    } catch (error) {
      res.status(400).json({ error: "Invalid scraper data" });
    }
  });

  app.delete("/api/scrapers/:id", async (req, res) => {
    try {
      await storage.deleteScraper(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete scraper" });
    }
  });

  app.post("/api/scrapers/test", async (req, res) => {
    try {
      const result = await scraperService.testScraper(req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Test failed" 
      });
    }
  });

  app.post("/api/scrapers/:id/run", async (req, res) => {
    try {
      await scraperService.runScraper(req.params.id);
      res.json({ success: true, message: "Scraper started" });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to start scraper" 
      });
    }
  });

  // Scraped data endpoints
  app.get("/api/scraped-data", async (req, res) => {
    try {
      const { scraperId, limit = "100", offset = "0" } = req.query;
      const data = await storage.getScrapedData(
        scraperId as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
      const total = await storage.getScrapedDataCount(scraperId as string);
      res.json({ data, total });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scraped data" });
    }
  });

  // Schedules endpoints
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch schedules" });
    }
  });

  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      
      // Schedule the task
      await schedulerService.scheduleTask(schedule);
      
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.put("/api/schedules/:id", async (req, res) => {
    try {
      const updates = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(req.params.id, updates);
      
      // Reschedule the task
      await schedulerService.scheduleTask(schedule);
      
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: "Invalid schedule data" });
    }
  });

  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      await schedulerService.stopTask(req.params.id);
      await storage.deleteSchedule(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete schedule" });
    }
  });

  app.post("/api/schedules/:id/pause", async (req, res) => {
    try {
      await schedulerService.pauseTask(req.params.id);
      res.json({ success: true, message: "Schedule paused" });
    } catch (error) {
      res.status(500).json({ error: "Failed to pause schedule" });
    }
  });

  app.post("/api/schedules/:id/resume", async (req, res) => {
    try {
      await schedulerService.resumeTask(req.params.id);
      res.json({ success: true, message: "Schedule resumed" });
    } catch (error) {
      res.status(500).json({ error: "Failed to resume schedule" });
    }
  });

  // Exports endpoints
  app.get("/api/exports", async (req, res) => {
    try {
      const exports = await storage.getExports();
      res.json(exports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exports" });
    }
  });

  app.post("/api/exports", async (req, res) => {
    try {
      const validatedData = insertExportSchema.parse(req.body);
      const exportRecord = await storage.createExport({
        ...validatedData,
        status: "generating"
      });
      
      // Start export generation in background
      generateExport(exportRecord.id, validatedData);
      
      res.status(201).json(exportRecord);
    } catch (error) {
      res.status(400).json({ error: "Invalid export data" });
    }
  });

  app.delete("/api/exports/:id", async (req, res) => {
    try {
      await storage.deleteExport(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete export" });
    }
  });

  // Social media endpoints
  app.get("/api/social-media-posts", async (req, res) => {
    try {
      const { platform, limit = "100" } = req.query;
      const posts = await storage.getSocialMediaPosts(
        undefined,
        platform as string,
        parseInt(limit as string)
      );
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social media posts" });
    }
  });

  app.post("/api/social-media-posts", async (req, res) => {
    try {
      const validatedData = insertSocialMediaPostSchema.parse(req.body);
      const post = await storage.createSocialMediaPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Social media post validation error:", error);
      res.status(400).json({ 
        error: "Invalid social media post data", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Helper function for export generation
  async function generateExport(exportId: string, exportData: any) {
    try {
      let data: any[] = [];
      
      if (exportData.sourceType === "scraped_data") {
        const result = await storage.getScrapedData(exportData.sourceId, 10000);
        data = result;
      }
      
      const filename = `${exportData.filename}.${exportData.format}`;
      const filePath = path.join(process.cwd(), 'exports', filename);
      
      // Ensure exports directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      if (exportData.format === 'json') {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      } else if (exportData.format === 'csv') {
        const csv = convertToCSV(data);
        await fs.writeFile(filePath, csv);
      }
      
      await storage.updateExport(exportId, {
        status: "completed",
        filePath,
        recordCount: data.length
      });
      
    } catch (error) {
      await storage.updateExport(exportId, { status: "failed" });
    }
  }

  function convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ];
    
    return csvRows.join('\n');
  }

  const httpServer = createServer(app);
  return httpServer;
}
