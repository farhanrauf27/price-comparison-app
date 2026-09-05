import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that require the user to be logged in
const protectedRoutes = ['/profile', '/favorites', '/search'];

// Define auth paths that logged-in users shouldn't visit (e.g., don't show login form if already logged in)
const authRoutes = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  // Retrieve the HTTP-only secure cookie we created during login
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. If the route is protected and no token is present, redirect to login
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    // Optional: add a redirect parameter so we can redirect them back after logging in
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If the user is already logged in, prevent them from accessing login/register pages
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

// Optimization: Configure the middleware to only run on actual page routes
// This prevents it from running on internal static images, fonts, or next/image optimization URLs
export const config = {
  matcher: [
    '/profile/:path*',
    '/favorites/:path*',
    '/search/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ],
};