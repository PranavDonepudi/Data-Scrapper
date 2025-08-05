import puppeteer, { Browser, Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { storage } from '../storage';
import { type Scraper, type InsertScrapedData } from '@shared/schema';

export class ScraperService {
  private browser: Browser | null = null;

  async initBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    return this.browser;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async scrapePage(scraper: Scraper, url: string): Promise<any> {
    const browser = await this.initBrowser();
    const page = await browser.newPage();

    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Navigate to page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for content to load
      await page.waitForTimeout(scraper.delay * 1000);
      
      // Get page content
      const content = await page.content();
      
      // Parse with Cheerio
      const $ = cheerio.load(content);
      
      // Extract data based on selectors
      const extractedData: any = {};
      const selectors = scraper.selectors as any;
      
      for (const [fieldName, selector] of Object.entries(selectors)) {
        if (typeof selector === 'string') {
          const element = $(selector);
          if (element.length > 1) {
            // Multiple elements - return array
            extractedData[fieldName] = element.map((i, el) => $(el).text().trim()).get();
          } else {
            // Single element
            extractedData[fieldName] = element.text().trim();
          }
        }
      }
      
      return extractedData;
    } finally {
      await page.close();
    }
  }

  async runScraper(scraperId: string): Promise<void> {
    const scraper = await storage.getScraper(scraperId);
    if (!scraper) {
      throw new Error('Scraper not found');
    }

    try {
      // Update scraper status
      await storage.updateScraper(scraperId, { 
        status: 'running',
        lastRun: new Date()
      });

      const urls = await this.generateUrls(scraper);
      let scrapedCount = 0;
      
      for (const url of urls.slice(0, scraper.maxPages)) {
        try {
          const data = await this.scrapePage(scraper, url);
          
          // Save scraped data
          await storage.createScrapedData({
            scraperId: scraper.id,
            data,
            url
          });
          
          scrapedCount++;
          
          // Rate limiting
          if (scraper.delay > 0) {
            await new Promise(resolve => setTimeout(resolve, scraper.delay * 1000));
          }
        } catch (error) {
          console.error(`Error scraping ${url}:`, error);
        }
      }

      // Update scraper status
      await storage.updateScraper(scraperId, { status: 'completed' });
      
    } catch (error) {
      await storage.updateScraper(scraperId, { status: 'failed' });
      throw error;
    }
  }

  private async generateUrls(scraper: Scraper): Promise<string[]> {
    // For now, just return the base URL
    // In a real implementation, this would handle pagination, sitemaps, etc.
    return [scraper.url];
  }

  async testScraper(scraper: Partial<Scraper>): Promise<any> {
    if (!scraper.url || !scraper.selectors) {
      throw new Error('URL and selectors are required for testing');
    }

    const testScraper: Scraper = {
      id: 'test',
      name: 'Test',
      url: scraper.url,
      method: scraper.method || 'puppeteer',
      selectors: scraper.selectors,
      delay: scraper.delay || 2,
      maxPages: 1,
      concurrentRequests: 1,
      status: 'testing',
      createdAt: new Date(),
      lastRun: null,
      userId: null
    };

    return await this.scrapePage(testScraper, scraper.url);
  }
}

export const scraperService = new ScraperService();
