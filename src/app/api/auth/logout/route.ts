import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth token cookie
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    // Clear the auth token cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Immediately expire the cookie
      path: '/',
    });

    // Clear NextAuth cookies too, so Google session does not linger in this app.
    const nextAuthCookies = [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
    ];

    for (const cookieName of nextAuthCookies) {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed', success: false },
      { status: 500 },
    );
  }
}
