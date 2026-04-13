import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// JWT Secret - seharusnya sama dengan yang digunakan di lib/auth/jwt.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
)

// Protected routes yang memerlukan authentication
const protectedRoutes = ['/dashboard', '/api/user', '/api/subscription', '/api/content', '/api/image']

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
  '/api/auth/me'
]

// Admin routes yang memerlukan authentication & role ADMIN/SUPER_ADMIN
const adminRoutes = ['/admin', '/api/admin']

// Public admin routes
const publicAdminRoutes = ['/admin/login', '/api/admin/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware untuk static files dan API routes yang tidak perlu protection
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') // static files seperti .css, .js, .png, etc.
  ) {
    return NextResponse.next()
  }

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isPublicAdminRoute = publicAdminRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))

  // If it's a public route and not a protected one, allow access
  if (isPublicAdminRoute) {
    return NextResponse.next()
  }

  if (isPublicRoute && !isProtectedRoute && !isAdminRoute) {
    return NextResponse.next()
  }

  // For Admin routes, check authentication and role
  if (isAdminRoute && !isPublicAdminRoute) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      if (!payload.userId) {
        throw new Error('Invalid token: no userId found')
      }

      // Check role for admin access
      if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Token and role are valid
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware admin auth error:', error)
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  // For protected routes, check authentication
  if (isProtectedRoute) {
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      // No token found, redirect to login with return URL (including query params)
      const loginUrl = new URL('/auth/login', request.url)
      // Preserve the full URL (pathname + searchParams) for redirect after login
      const fullUrl = request.nextUrl.clone()
      const returnUrl = `${fullUrl.pathname}${fullUrl.search}`
      loginUrl.searchParams.set('redirect', returnUrl)

      console.log('🔄 Auth redirect:', {
        originalUrl: request.url,
        pathname,
        search: request.nextUrl.search,
        returnUrl,
        loginUrl: loginUrl.toString()
      })

      return NextResponse.redirect(loginUrl)
    }

    try {
      // Verify JWT token
      const { payload } = await jwtVerify(token, JWT_SECRET)

      if (!payload.userId) {
        throw new Error('Invalid token: no userId found')
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)

      // Invalid token, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url))
      response.cookies.delete('auth_token')
      return response
    }
  }

  // Default: allow access
  return NextResponse.next()
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
}