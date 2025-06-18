import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/', '/api/sentry-example-page', '/sentry-example-page', '/privacy-policy', '/terms-of-service', '/auth/login', '/auth/signup', '/auth/verify-email', '/auth/callback']

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Handle direct /auth visits - redirect to login
  if (pathname === '/auth') {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Redirect authenticated users trying to access auth pages
  if (pathname.startsWith('/auth') && !pathname.startsWith('/auth/callback')) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Protect all non-public routes
  if (!publicRoutes.includes(pathname)) {
    if (!session) {
      // Store the original URL to redirect back after login
      const redirectUrl = new URL('/auth/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

// Specify which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
} 