import { ActivityType } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Types untuk activity logging
export interface ActivityLog {
  id: string;
  userId: string;
  activityType: ActivityType;
  action: string;
  description: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  duration?: number;
  timestamp: Date;
}

export interface ActivityStats {
  totalContentGenerations: number;
  totalImageGenerations: number;
  todayContentGenerations: number;
  todayImageGenerations: number;
  weeklyContentGenerations: number;
  weeklyImageGenerations: number;
  monthlyContentGenerations: number;
  monthlyImageGenerations: number;
  mostUsedContentType?: string;
  mostUsedImageMode?: string;
  mostUsedPlatform?: string;
  mostUsedImageSize?: string;
}

export interface DailyStats {
  date: string;
  contentCount: number;
  imageCount: number;
  totalTokensUsed: number;
  averageGenerationTime: number;
}

// Activity types untuk tracking
export const ACTIVITY_TYPES = {
  CONTENT_GENERATION: 'CONTENT_GENERATION' as const,
  IMAGE_GENERATION: 'IMAGE_GENERATION' as const,
  LOGIN: 'LOGIN' as const,
  LOGOUT: 'LOGOUT' as const,
  PROFILE_UPDATE: 'PROFILE_UPDATE' as const,
  SETTINGS_UPDATE: 'SETTINGS_UPDATE' as const,
} as const;

// Content types untuk tracking
export const CONTENT_TYPES = {
  CAPTION: 'caption',
  BLOG: 'blog',
  EMAIL: 'email',
  SOCIAL: 'social',
  PRODUCT: 'product',
} as const;

// Image modes untuk tracking
export const IMAGE_MODES = {
  REALISTIC: 'realistic',
  POSTER: 'poster',
  PRODUCT: 'product',
} as const;

// Generate unique session ID
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get client IP address (server-side only)
export const getClientIP = (request: any): string => {
  return request?.headers['x-forwarded-for'] ||
         request?.headers['x-real-ip'] ||
         request?.connection?.remoteAddress ||
         request?.socket?.remoteAddress ||
         'unknown';
};

// Get user agent (server-side only)
export const getUserAgent = (request: any): string => {
  return request?.headers['user-agent'] || 'unknown';
};

// Calculate date ranges
export const getDateRanges = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  return { now, today, weekAgo, monthAgo };
};

// Format duration in milliseconds to human readable
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
};

// Validate activity log data
export const validateActivityLog = (log: Partial<ActivityLog>): boolean => {
  return !!(
    log.userId &&
    log.activityType &&
    log.action &&
    log.timestamp
  );
};

// Database operations for activity logging
export const ActivityDBService = {
  // Create activity log
  async createActivityLog(data: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    try {
      const activityLog = await prisma.activityLog.create({
        data: {
          userId: data.userId,
          activityType: data.activityType,
          action: data.action,
          description: data.description,
          metadata: data.metadata,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          success: data.success,
          errorMessage: data.errorMessage,
          duration: data.duration,
        },
      });

      return {
        id: activityLog.id,
        userId: activityLog.userId,
        activityType: activityLog.activityType,
        action: activityLog.action,
        description: activityLog.description,
        metadata: activityLog.metadata,
        ipAddress: activityLog.ipAddress,
        userAgent: activityLog.userAgent,
        success: activityLog.success,
        errorMessage: activityLog.errorMessage,
        duration: activityLog.duration,
        timestamp: activityLog.timestamp,
      };
    } catch (error) {
      console.error('Failed to create activity log:', error);
      throw error;
    }
  },

  // Get activity logs for user
  async getUserActivityLogs(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ActivityLog[]> {
    try {
      const logs = await prisma.activityLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
      });

      return logs.map(log => ({
        id: log.id,
        userId: log.userId,
        activityType: log.activityType,
        action: log.action,
        description: log.description,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        success: log.success,
        errorMessage: log.errorMessage,
        duration: log.duration,
        timestamp: log.timestamp,
      }));
    } catch (error) {
      console.error('Failed to get user activity logs:', error);
      throw error;
    }
  },

  // Get activity statistics for user
  async getUserActivityStats(userId: string): Promise<ActivityStats> {
    try {
      const { today, weekAgo, monthAgo } = getDateRanges();

      // Get all activity logs for the user
      const allLogs = await prisma.activityLog.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
      });

      // Filter by date ranges and activity types
      const contentLogs = allLogs.filter(log => log.activityType === 'CONTENT_GENERATION');
      const imageLogs = allLogs.filter(log => log.activityType === 'IMAGE_GENERATION');

      const todayContentLogs = contentLogs.filter(log => log.timestamp >= today);
      const todayImageLogs = imageLogs.filter(log => log.timestamp >= today);
      const weeklyContentLogs = contentLogs.filter(log => log.timestamp >= weekAgo);
      const weeklyImageLogs = imageLogs.filter(log => log.timestamp >= weekAgo);
      const monthlyContentLogs = contentLogs.filter(log => log.timestamp >= monthAgo);
      const monthlyImageLogs = imageLogs.filter(log => log.timestamp >= monthAgo);

      // Calculate most used types
      const contentTypeStats = contentLogs.reduce((acc, log) => {
        const contentType = log.metadata?.contentType || 'unknown';
        acc[contentType] = (acc[contentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const imageModeStats = imageLogs.reduce((acc, log) => {
        const imageMode = log.metadata?.imageMode || 'unknown';
        acc[imageMode] = (acc[imageMode] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const platformStats = contentLogs.reduce((acc, log) => {
        const platforms = log.metadata?.platform || [];
        platforms.forEach((platform: string) => {
          acc[platform] = (acc[platform] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const imageSizeStats = imageLogs.reduce((acc, log) => {
        const imageSize = log.metadata?.imageSize || 'unknown';
        acc[imageSize] = (acc[imageSize] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostUsedContentType = Object.entries(contentTypeStats)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      const mostUsedImageMode = Object.entries(imageModeStats)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      const mostUsedPlatform = Object.entries(platformStats)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      const mostUsedImageSize = Object.entries(imageSizeStats)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      return {
        totalContentGenerations: contentLogs.length,
        totalImageGenerations: imageLogs.length,
        todayContentGenerations: todayContentLogs.length,
        todayImageGenerations: todayImageLogs.length,
        weeklyContentGenerations: weeklyContentLogs.length,
        weeklyImageGenerations: weeklyImageLogs.length,
        monthlyContentGenerations: monthlyContentLogs.length,
        monthlyImageGenerations: monthlyImageLogs.length,
        mostUsedContentType,
        mostUsedImageMode,
        mostUsedPlatform,
        mostUsedImageSize,
      };
    } catch (error) {
      console.error('Failed to get user activity stats:', error);
      throw error;
    }
  },

  // Get daily stats for the last 7 days
  async getDailyStats(userId: string): Promise<DailyStats[]> {
    try {
      const { today } = getDateRanges();
      const dailyStats: DailyStats[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const dayLogs = await prisma.activityLog.findMany({
          where: {
            userId,
            timestamp: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        });

        const contentLogs = dayLogs.filter(log => log.activityType === 'CONTENT_GENERATION');
        const imageLogs = dayLogs.filter(log => log.activityType === 'IMAGE_GENERATION');

        const totalTokensUsed = contentLogs.reduce((sum, log) =>
          sum + (log.metadata?.tokensUsed || 0), 0
        );

        const generationTimes = contentLogs
          .concat(imageLogs)
          .map(log => log.metadata?.generationTime || 0)
          .filter(time => time > 0);

        const averageGenerationTime = generationTimes.length > 0
          ? generationTimes.reduce((sum, time) => sum + time, 0) / generationTimes.length
          : 0;

        dailyStats.push({
          date: startOfDay.toISOString(),
          contentCount: contentLogs.length,
          imageCount: imageLogs.length,
          totalTokensUsed,
          averageGenerationTime: Math.round(averageGenerationTime),
        });
      }

      return dailyStats;
    } catch (error) {
      console.error('Failed to get daily stats:', error);
      throw error;
    }
  },

  // Clean up old activity logs (optional cleanup job)
  async cleanupOldLogs(daysToKeep: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      await prisma.activityLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });

      console.log(`Cleaned up activity logs older than ${daysToKeep} days`);
    } catch (error) {
      console.error('Failed to cleanup old activity logs:', error);
      throw error;
    }
  },
};