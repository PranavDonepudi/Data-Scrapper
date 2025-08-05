import * as cron from 'node-cron';
import { storage } from '../storage';
import { scraperService } from './scraper';
import { type Schedule } from '@shared/schema';

export class SchedulerService {
  private scheduledTasks: Map<string, cron.ScheduledTask> = new Map();

  async initializeSchedules() {
    const schedules = await storage.getSchedules();
    
    for (const schedule of schedules) {
      if (schedule.isActive) {
        await this.scheduleTask(schedule);
      }
    }
  }

  async scheduleTask(schedule: Schedule) {
    // Stop existing task if it exists
    await this.stopTask(schedule.id);

    const cronExpression = this.getCronExpression(schedule);
    
    if (!cron.validate(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const task = cron.schedule(cronExpression, async () => {
      try {
        console.log(`Running scheduled task: ${schedule.name}`);
        
        if (schedule.scraperId) {
          await scraperService.runScraper(schedule.scraperId);
        }
        
        // Update next run time
        const nextRun = this.getNextRunTime(schedule);
        await storage.updateSchedule(schedule.id, { nextRun });
        
      } catch (error) {
        console.error(`Error running scheduled task ${schedule.name}:`, error);
      }
    }, {
      scheduled: false
    });

    this.scheduledTasks.set(schedule.id, task);
    task.start();
  }

  async stopTask(scheduleId: string) {
    const task = this.scheduledTasks.get(scheduleId);
    if (task) {
      task.stop();
      this.scheduledTasks.delete(scheduleId);
    }
  }

  async pauseTask(scheduleId: string) {
    await storage.updateSchedule(scheduleId, { isActive: false });
    await this.stopTask(scheduleId);
  }

  async resumeTask(scheduleId: string) {
    await storage.updateSchedule(scheduleId, { isActive: true });
    const schedule = await storage.getSchedule(scheduleId);
    if (schedule) {
      await this.scheduleTask(schedule);
    }
  }

  private getCronExpression(schedule: Schedule): string {
    if (schedule.cronExpression) {
      return schedule.cronExpression;
    }

    switch (schedule.frequency) {
      case 'hourly':
        return '0 * * * *';
      case 'daily':
        return '0 9 * * *'; // 9 AM daily
      case 'weekly':
        return '0 9 * * 1'; // 9 AM every Monday
      case 'monthly':
        return '0 9 1 * *'; // 9 AM first day of month
      default:
        throw new Error(`Unknown frequency: ${schedule.frequency}`);
    }
  }

  private getNextRunTime(schedule: Schedule): Date {
    const cronExpression = this.getCronExpression(schedule);
    // This is a simplified calculation - in production you'd use a proper cron parser
    const now = new Date();
    
    switch (schedule.frequency) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(9, 0, 0, 0);
        return nextWeek;
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
        nextMonth.setHours(9, 0, 0, 0);
        return nextMonth;
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }
}

export const schedulerService = new SchedulerService();
