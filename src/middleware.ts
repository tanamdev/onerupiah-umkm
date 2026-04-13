import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected routes yang memerlukan authentication
const protectedRoutes = [
  '/dashboard',
  '/api/user',
  '/api/subscription',
  '/api/content',
  '/api/image',
];

// Public routes yang tidak memerlukan authentication
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/pricing',
  '/unauthorized',
  '/payment-status', // Payment status page should be accessible without auth
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/me',
];

// Admin routes yang memerlukan authentication & role ADMIN/SUPER_ADMIN
const adminRoutes = ['/admin', '/api/admin'];

// Public admin routes
const publicAdminRoutes = ['/admin/login', '/api/admin/auth/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware untuk static files dan API routes yang tidak perlu protection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // static files seperti .css, .js, .png, etc.
  ) {
    return NextResponse.next();
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isPublicAdminRoute = publicAdminRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  // If it's a public route and not a protected one, allow access
  if (isPublicAdminRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute && !isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // For Admin routes, check authentication and role
  if (isAdminRoute && !isPublicAdminRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const role = (token as any).role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      // No token found, redirect to login with return URL (including query params)
      const loginUrl = new URL('/auth/login', request.url);
      // Preserve the full URL (pathname + searchParams) for redirect after login
      const fullUrl = request.nextUrl.clone();
      const returnUrl = `${fullUrl.pathname}${fullUrl.search}`;
      loginUrl.searchParams.set('redirect', returnUrl);

      console.log('🔄 Auth redirect:', {
        originalUrl: request.url,
        pathname,
        search: request.nextUrl.search,
        returnUrl,
        loginUrl: loginUrl.toString(),
      });

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

// Configure middleware untuk berjalan hanya pada routes tertentu
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
