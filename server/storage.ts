import { 
  users, scrapers, scrapedData, schedules, exports, socialMediaPosts,
  type User, type InsertUser,
  type Scraper, type InsertScraper,
  type ScrapedData, type InsertScrapedData,
  type Schedule, type InsertSchedule,
  type Export, type InsertExport,
  type SocialMediaPost, type InsertSocialMediaPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Scrapers
  getScrapers(userId?: string): Promise<Scraper[]>;
  getScraper(id: string): Promise<Scraper | undefined>;
  createScraper(scraper: InsertScraper): Promise<Scraper>;
  updateScraper(id: string, updates: Partial<InsertScraper>): Promise<Scraper>;
  deleteScraper(id: string): Promise<void>;

  // Scraped Data
  getScrapedData(scraperId?: string, limit?: number, offset?: number): Promise<ScrapedData[]>;
  createScrapedData(data: InsertScrapedData): Promise<ScrapedData>;
  getScrapedDataCount(scraperId?: string): Promise<number>;

  // Schedules
  getSchedules(userId?: string): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, updates: Partial<InsertSchedule>): Promise<Schedule>;
  deleteSchedule(id: string): Promise<void>;

  // Exports
  getExports(userId?: string): Promise<Export[]>;
  createExport(exportData: InsertExport): Promise<Export>;
  updateExport(id: string, updates: Partial<InsertExport>): Promise<Export>;
  deleteExport(id: string): Promise<void>;

  // Social Media
  getSocialMediaPosts(userId?: string, platform?: string, limit?: number): Promise<SocialMediaPost[]>;
  createSocialMediaPost(post: InsertSocialMediaPost): Promise<SocialMediaPost>;

  // Analytics
  getStats(userId?: string): Promise<{
    totalRecords: number;
    activeScrapers: number;
    apiCalls: number;
    successRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getScrapers(userId?: string): Promise<Scraper[]> {
    if (userId) {
      return await db.select().from(scrapers).where(eq(scrapers.userId, userId)).orderBy(desc(scrapers.createdAt));
    }
    return await db.select().from(scrapers).orderBy(desc(scrapers.createdAt));
  }

  async getScraper(id: string): Promise<Scraper | undefined> {
    const [scraper] = await db.select().from(scrapers).where(eq(scrapers.id, id));
    return scraper || undefined;
  }

  async createScraper(scraper: InsertScraper): Promise<Scraper> {
    const [newScraper] = await db
      .insert(scrapers)
      .values(scraper)
      .returning();
    return newScraper;
  }

  async updateScraper(id: string, updates: Partial<InsertScraper>): Promise<Scraper> {
    const [updatedScraper] = await db
      .update(scrapers)
      .set(updates)
      .where(eq(scrapers.id, id))
      .returning();
    return updatedScraper;
  }

  async deleteScraper(id: string): Promise<void> {
    await db.delete(scrapers).where(eq(scrapers.id, id));
  }

  async getScrapedData(scraperId?: string, limit = 100, offset = 0): Promise<ScrapedData[]> {
    let query = db.select().from(scrapedData);
    
    if (scraperId) {
      query = query.where(eq(scrapedData.scraperId, scraperId));
    }
    
    return await query
      .orderBy(desc(scrapedData.scrapedAt))
      .limit(limit)
      .offset(offset);
  }

  async createScrapedData(data: InsertScrapedData): Promise<ScrapedData> {
    const [newData] = await db
      .insert(scrapedData)
      .values(data)
      .returning();
    return newData;
  }

  async getScrapedDataCount(scraperId?: string): Promise<number> {
    let query = db.select({ count: count() }).from(scrapedData);
    
    if (scraperId) {
      query = query.where(eq(scrapedData.scraperId, scraperId));
    }
    
    const [result] = await query;
    return result.count;
  }

  async getSchedules(userId?: string): Promise<Schedule[]> {
    if (userId) {
      return await db.select().from(schedules).where(eq(schedules.userId, userId)).orderBy(desc(schedules.createdAt));
    }
    return await db.select().from(schedules).orderBy(desc(schedules.createdAt));
  }

  async getSchedule(id: string): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule || undefined;
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db
      .insert(schedules)
      .values(schedule)
      .returning();
    return newSchedule;
  }

  async updateSchedule(id: string, updates: Partial<InsertSchedule>): Promise<Schedule> {
    const [updatedSchedule] = await db
      .update(schedules)
      .set(updates)
      .where(eq(schedules.id, id))
      .returning();
    return updatedSchedule;
  }

  async deleteSchedule(id: string): Promise<void> {
    await db.delete(schedules).where(eq(schedules.id, id));
  }

  async getExports(userId?: string): Promise<Export[]> {
    if (userId) {
      return await db.select().from(exports).where(eq(exports.userId, userId)).orderBy(desc(exports.createdAt));
    }
    return await db.select().from(exports).orderBy(desc(exports.createdAt));
  }

  async createExport(exportData: InsertExport): Promise<Export> {
    const [newExport] = await db
      .insert(exports)
      .values(exportData)
      .returning();
    return newExport;
  }

  async updateExport(id: string, updates: Partial<InsertExport>): Promise<Export> {
    const [updatedExport] = await db
      .update(exports)
      .set(updates)
      .where(eq(exports.id, id))
      .returning();
    return updatedExport;
  }

  async deleteExport(id: string): Promise<void> {
    await db.delete(exports).where(eq(exports.id, id));
  }

  async getSocialMediaPosts(userId?: string, platform?: string, limit = 100): Promise<SocialMediaPost[]> {
    let query = db.select().from(socialMediaPosts);
    
    const conditions = [];
    if (userId) conditions.push(eq(socialMediaPosts.userId, userId));
    if (platform) conditions.push(eq(socialMediaPosts.platform, platform));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(socialMediaPosts.collectedAt))
      .limit(limit);
  }

  async createSocialMediaPost(post: InsertSocialMediaPost): Promise<SocialMediaPost> {
    const [newPost] = await db
      .insert(socialMediaPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getStats(userId?: string): Promise<{
    totalRecords: number;
    activeScrapers: number;
    apiCalls: number;
    successRate: number;
  }> {
    // Get total scraped records
    let recordQuery = db.select({ count: count() }).from(scrapedData);
    if (userId) {
      recordQuery = recordQuery
        .innerJoin(scrapers, eq(scrapedData.scraperId, scrapers.id))
        .where(eq(scrapers.userId, userId));
    }
    const [recordCount] = await recordQuery;

    // Get active scrapers
    let scraperQuery = db.select({ count: count() }).from(scrapers).where(eq(scrapers.status, 'active'));
    if (userId) {
      scraperQuery = scraperQuery.where(and(eq(scrapers.status, 'active'), eq(scrapers.userId, userId)));
    }
    const [activeScrapersCount] = await scraperQuery;

    // Mock API calls and success rate for now (would need to track these in real implementation)
    return {
      totalRecords: recordCount.count,
      activeScrapers: activeScrapersCount.count,
      apiCalls: 1247, // This would come from API usage tracking
      successRate: 94.2, // This would come from success/failure tracking
    };
  }
}

export const storage = new DatabaseStorage();
