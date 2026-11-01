import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip non-admin routes, login page, access-denied page, and Next internals
  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api/admin')
  ) {
    return NextResponse.next();
  }

  // Allow public admin endpoints (login and access denied)
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/access-denied' ||
    pathname === '/api/admin/login'
  ) {
    return NextResponse.next();
  }

  // 2. Extract admin session cookie
  const sessionCookie = request.cookies.get('chronova_admin_session');

  // If no session exists
  if (!sessionCookie || !sessionCookie.value) {
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required' },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Verify session value & role
  const val = sessionCookie.value;
  if (val === 'authenticated_admin') {
    return NextResponse.next();
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(val));
    if (parsed.role === 'admin' || parsed.role === 'manager') {
      return NextResponse.next();
    }

    // Authenticated user lacks admin role (e.g. customer)
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Forbidden: Admin privilege required' },
        { status: 403 }
      );
    }

    return NextResponse.redirect(new URL('/admin/access-denied', request.url));
  } catch {
    // If cookie format is corrupted, force login
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid admin session' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
