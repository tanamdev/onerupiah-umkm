import { NextRequest, NextResponse } from 'next/server';
import { ActivityDBService } from '@/services/activityService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityType, action, description, metadata, success, errorMessage, duration, sessionId } = body;

    // Validate required fields
    if (!userId || !activityType || !action || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, activityType, action, description' },
        { status: 400 }
      );
    }

    // Create activity log in database
    const activityLog = await ActivityDBService.createActivityLog({
      userId,
      activityType,
      action,
      description,
      metadata: metadata || {},
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
      success: success !== undefined ? success : true,
      errorMessage,
      duration,
    });

    console.log('📊 Activity Logged to Database:', {
      userId: activityLog.userId,
      activityType: activityLog.activityType,
      action: activityLog.action,
      timestamp: activityLog.timestamp
    });

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully',
      activityId: activityLog.id
    });

  } catch (error) {
    console.error('❌ Error logging activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      );
    }

    // Get activity logs from database
    const activityLogs = await ActivityDBService.getUserActivityLogs(userId, limit, offset);

    return NextResponse.json({
      success: true,
      data: activityLogs,
      total: activityLogs.length
    });

  } catch (error) {
    console.error('❌ Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getClientIP(request: NextRequest): string {
  const headerCandidates = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip',
    'true-client-ip',
    'x-client-ip',
  ];

  for (const headerName of headerCandidates) {
    const rawHeader = request.headers.get(headerName);
    if (!rawHeader) continue;

    const ip = rawHeader.split(',')[0]?.trim();
    if (ip) return ip;
  }

  return process.env.NODE_ENV === 'development' ? '127.0.0.1' : 'unknown';
}

function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
