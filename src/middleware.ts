import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(async function middleware(req) {
  // Skip middleware for blob URLs
  if (req.nextUrl.pathname.startsWith('/blob:')) {
    return NextResponse.next()
  }

  const token = await getToken({ req })
  const isAuthenticated = !!token

  if (req.nextUrl.pathname === '/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }
})

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - login page
     * - kiosk main route
     * - static files
     * - image files
     * - public assets
     */
    '/((?!api|_next|login|kiosk|tracer-notifications|images|illustrations|favicon.ico|sounds).*)',
    '/kiosk-configurations/:path*'
  ]
}
