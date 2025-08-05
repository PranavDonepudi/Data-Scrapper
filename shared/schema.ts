import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("product_manager"),
});

export const scrapers = pgTable("scrapers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  method: text("method").notNull().default("puppeteer"),
  selectors: jsonb("selectors").notNull(),
  delay: integer("delay").notNull().default(2),
  maxPages: integer("max_pages").notNull().default(100),
  concurrentRequests: integer("concurrent_requests").notNull().default(1),
  status: text("status").notNull().default("inactive"),
  createdAt: timestamp("created_at").defaultNow(),
  lastRun: timestamp("last_run"),
  userId: varchar("user_id").references(() => users.id),
});

export const scrapedData = pgTable("scraped_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scraperId: varchar("scraper_id").references(() => scrapers.id),
  data: jsonb("data").notNull(),
  url: text("url").notNull(),
  scrapedAt: timestamp("scraped_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scraperId: varchar("scraper_id").references(() => scrapers.id),
  name: text("name").notNull(),
  frequency: text("frequency").notNull(), // hourly, daily, weekly, monthly, cron
  cronExpression: text("cron_expression"),
  nextRun: timestamp("next_run"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  userId: varchar("user_id").references(() => users.id),
});

export const exports = pgTable("exports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  format: text("format").notNull(), // csv, json, xlsx, xml
  sourceType: text("source_type").notNull(),
  sourceId: varchar("source_id"),
  status: text("status").notNull().default("generating"),
  filePath: text("file_path"),
  recordCount: integer("record_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  userId: varchar("user_id").references(() => users.id),
});

export const socialMediaPosts = pgTable("social_media_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(), // twitter, facebook, instagram, linkedin
  postId: text("post_id").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  url: text("url"),
  mentions: jsonb("mentions"),
  hashtags: jsonb("hashtags"),
  engagement: jsonb("engagement"), // likes, shares, comments count
  postedAt: timestamp("posted_at"),
  collectedAt: timestamp("collected_at").defaultNow(),
  userId: varchar("user_id").references(() => users.id),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  scrapers: many(scrapers),
  schedules: many(schedules),
  exports: many(exports),
  socialMediaPosts: many(socialMediaPosts),
}));

export const scrapersRelations = relations(scrapers, ({ one, many }) => ({
  user: one(users, { fields: [scrapers.userId], references: [users.id] }),
  scrapedData: many(scrapedData),
  schedules: many(schedules),
}));

export const scrapedDataRelations = relations(scrapedData, ({ one }) => ({
  scraper: one(scrapers, { fields: [scrapedData.scraperId], references: [scrapers.id] }),
}));

export const schedulesRelations = relations(schedules, ({ one }) => ({
  scraper: one(scrapers, { fields: [schedules.scraperId], references: [scrapers.id] }),
  user: one(users, { fields: [schedules.userId], references: [users.id] }),
}));

export const exportsRelations = relations(exports, ({ one }) => ({
  user: one(users, { fields: [exports.userId], references: [users.id] }),
}));

export const socialMediaPostsRelations = relations(socialMediaPosts, ({ one }) => ({
  user: one(users, { fields: [socialMediaPosts.userId], references: [users.id] }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertScraperSchema = createInsertSchema(scrapers).omit({
  id: true,
  createdAt: true,
  lastRun: true,
});

export const insertScrapedDataSchema = createInsertSchema(scrapedData).omit({
  id: true,
  scrapedAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export const insertExportSchema = createInsertSchema(exports).omit({
  id: true,
  createdAt: true,
});

export const insertSocialMediaPostSchema = createInsertSchema(socialMediaPosts).omit({
  id: true,
  collectedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Scraper = typeof scrapers.$inferSelect;
export type InsertScraper = z.infer<typeof insertScraperSchema>;

export type ScrapedData = typeof scrapedData.$inferSelect;
export type InsertScrapedData = z.infer<typeof insertScrapedDataSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Export = typeof exports.$inferSelect;
export type InsertExport = z.infer<typeof insertExportSchema>;

export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;
export type InsertSocialMediaPost = z.infer<typeof insertSocialMediaPostSchema>;
