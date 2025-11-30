import { ActivityType, ACTIVITY_TYPES, CONTENT_TYPES, IMAGE_MODES, formatDuration } from './activityService';
import { useUser } from '@/contexts/UserContext';

class ActivityLogger {
  private sessionId: string;
  private isEnabled: boolean = true;
  private userId: string | null = null;
  private userEmail: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserFromContext();
  }

  private generateSessionId(): string {
    // Generate dari localStorage jika ada, atau buat baru
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('activitySessionId');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('activitySessionId', sessionId);
      }
      return sessionId;
    }
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserFromContext(): void {
    // Coba load user data dari context atau localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          this.userId = parsed.id || parsed.userId;
          this.userEmail = parsed.email || parsed.userEmail;
        } catch (error) {
          console.warn('Failed to parse user data from localStorage');
        }
      }
    }
  }

  // Set user info (dipanggil dari context atau auth state)
  public setUserInfo(userId: string, userEmail?: string): void {
    this.userId = userId;
    this.userEmail = userEmail;
  }

  // Enable/disable logging
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Get current session ID
  public getSessionId(): string {
    return this.sessionId;
  }

  // Core logging method
  private async logActivity(
    activityType: ActivityType,
    action: string,
    description: string,
    metadata?: any,
    success: boolean = true,
    errorMessage?: string,
    duration?: number
  ): Promise<void> {
    if (!this.isEnabled || !this.userId) {
      console.log('📊 Activity Logging Disabled or No User:', {
        activityType,
        action,
        description,
        metadata
      });
      return;
    }

    try {
      // Send to API
      const response = await fetch('/api/activity/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId!,
          activityType,
          action,
          description,
          metadata: metadata || {},
          success,
          errorMessage,
          duration,
          sessionId: this.sessionId,
        }),
      });

      if (!response.ok) {
        console.warn('Failed to log activity:', response.status, response.statusText);
      } else {
        console.log('📊 Activity Logged Successfully:', {
          activityType,
          action,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Specific logging methods
  public async logContentGeneration(
    contentType: string,
    config: any,
    success: boolean,
    errorMessage?: string,
    generationTime?: number,
    result?: any
  ): Promise<void> {
    await this.logActivity(
      'CONTENT_GENERATION',
      'content_generated',
      `Generated ${contentType} content${success ? ' successfully' : ' with error'}`,
      {
        contentType,
        platform: config.platforms || ['general'],
        tone: config.tone,
        targetAudience: config.targetAudience,
        generationTime,
        wordCount: result?.wordCount,
        tokensUsed: this.calculateTokens(result?.content || ''),
      },
      success,
      errorMessage,
      generationTime
    );
  }

  public async logImageGeneration(
    imageMode: string,
    config: any,
    success: boolean,
    errorMessage?: string,
    generationTime?: number,
    resultCount: number = 2
  ): Promise<void> {
    await this.logActivity(
      'IMAGE_GENERATION',
      'image_generated',
      `Generated ${resultCount} ${imageMode} image(s)${success ? ' successfully' : ' with error'}`,
      {
        imageMode,
        imageSize: config.imageSize?.name || 'Custom',
        platingStyle: config.platingStyle,
        backgroundStyle: config.backgroundStyle,
        posterStyle: config.posterStyle,
        generationTime,
        resultCount,
        tokensUsed: this.calculateImageTokens(config.imageSize),
      },
      success,
      errorMessage,
      generationTime
    );
  }

  public async logLogin(userEmail?: string): Promise<void> {
    if (userEmail) {
      this.userEmail = userEmail;
    }
    await this.logActivity(
      'LOGIN',
      'user_login',
      'User logged in to dashboard'
    );
  }

  public async logLogout(): Promise<void> {
    await this.logActivity(
      'LOGOUT',
      'user_logout',
      'User logged out from dashboard'
    );
  }

  public async logProfileUpdate(fields: string[]): Promise<void> {
    await this.logActivity(
      'PROFILE_UPDATE',
      'profile_updated',
      `User updated profile: ${fields.join(', ')}`
    );
  }

  public async logSettingsUpdate(settings: Record<string, any>): Promise<void> {
    const updatedFields = Object.keys(settings);
    await this.logActivity(
      'SETTINGS_UPDATE',
      'settings_updated',
      `User updated settings: ${updatedFields.join(', ')}`
    );
  }

  // Utility methods
  private calculateTokens(content: string): number {
    // Simple estimation: ~1 token per 4 characters
    return Math.ceil(content.length / 4);
  }

  private calculateImageTokens(imageSize: any): number {
    // Estimate tokens based on image size
    const baseTokens = 1000;
    const sizeMultiplier = imageSize?.width ? (imageSize.width * imageSize.height) / (1080 * 1080) : 1;
    return Math.ceil(baseTokens * sizeMultiplier);
  }

  // Performance tracking wrapper
  public async withPerformanceTracking<T>(
    activityType: 'content' | 'image',
    operation: () => Promise<T>,
    config?: any
  ): Promise<T> {
    const startTime = Date.now();
    let success = true;
    let errorMessage: string | undefined;

    try {
      const result = await operation();
      return result;
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    } finally {
      const duration = Date.now() - startTime;

      if (activityType === 'content' && config) {
        await this.logContentGeneration(
          config.contentType || 'unknown',
          config,
          success,
          errorMessage,
          duration
        );
      } else if (activityType === 'image' && config) {
        await this.logImageGeneration(
          config.imageMode || 'unknown',
          config,
          success,
          errorMessage,
          duration
        );
      }
    }
  }
}

// Export singleton instance
export const activityLogger = new ActivityLogger();

// Export hook for easy use in components
export const useActivityLogger = () => {
  const { user } = useUser();

  // Update logger with current user when user changes
  if (user && user.id) {
    activityLogger.setUserInfo(user.id, user.email);
  }

  return activityLogger;
};