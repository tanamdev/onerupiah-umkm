import { NextRequest, NextResponse } from 'next/server';
import { ActivityDBService } from '@/services/activityService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const period = searchParams.get('period') || 'all'; // all, today, week, month

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Get statistics from database
    const stats = await ActivityDBService.getUserActivityStats(userId);
    const dailyStats = await ActivityDBService.getDailyStats(userId);
    const recentActivities = await ActivityDBService.getUserActivityLogs(userId, 10, 0);

    return NextResponse.json({
      success: true,
      data: {
        stats,
        dailyStats,
        recentActivities,
        totalActivities: recentActivities.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching activity stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}