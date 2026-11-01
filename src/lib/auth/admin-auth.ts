import { cookies } from 'next/headers';
import { createClient as createServerClient } from '@/lib/supabase/server';

export const ADMIN_COOKIE_NAME = 'chronova_admin_session';

export interface AdminAuthUser {
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'customer';
}

export interface AdminAuthStatus {
  authenticated: boolean;
  isAdmin: boolean;
  user: AdminAuthUser | null;
}

/**
 * Server-side evaluation of the user's authentication and authorization role.
 * Inspects both secure HTTP cookies and Supabase Auth sessions.
 */
export async function getAdminAuthStatus(): Promise<AdminAuthStatus> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);

  // 1. Check chronova_admin_session cookie
  if (sessionCookie?.value) {
    if (sessionCookie.value === 'authenticated_admin') {
      return {
        authenticated: true,
        isAdmin: true,
        user: {
          email: 'admin@chronova.uz',
          name: 'CHRONOVA Bosh Administrator',
          role: 'admin',
        },
      };
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed.role === 'admin' || parsed.role === 'manager') {
        return {
          authenticated: true,
          isAdmin: true,
          user: {
            email: parsed.email || 'admin@chronova.uz',
            name: parsed.name || 'CHRONOVA Administrator',
            role: parsed.role,
          },
        };
      } else {
        // Authenticated non-admin user
        return {
          authenticated: true,
          isAdmin: false,
          user: {
            email: parsed.email || 'mijoz@chronova.uz',
            name: parsed.name || 'Hurmatli Mijoz',
            role: 'customer',
          },
        };
      }
    } catch {
      // If parsing fails but value equals authenticated_admin
      if (sessionCookie.value === 'authenticated_admin') {
        return {
          authenticated: true,
          isAdmin: true,
          user: {
            email: 'admin@chronova.uz',
            name: 'CHRONOVA Administrator',
            role: 'admin',
          },
        };
      }
    }
  }

  // 2. Check Supabase Auth session via cookies
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user && !error) {
      // Check role in user metadata or profiles table
      const role =
        user.app_metadata?.role || user.user_metadata?.role || 'customer';
      const isRoleAdmin = role === 'admin' || role === 'manager';

      return {
        authenticated: true,
        isAdmin: isRoleAdmin,
        user: {
          email: user.email || 'admin@chronova.uz',
          name:
            user.user_metadata?.full_name ||
            (isRoleAdmin ? 'CHRONOVA Administrator' : 'Hurmatli Mijoz'),
          role: isRoleAdmin ? 'admin' : 'customer',
        },
      };
    }
  } catch {
    // Offline/in-memory fallback when Supabase server is not configured
  }

  // 3. Unauthenticated visitor
  return {
    authenticated: false,
    isAdmin: false,
    user: null,
  };
}

/**
 * Returns true only if the user is authenticated AND possesses the 'admin' or 'manager' role.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const status = await getAdminAuthStatus();
  return status.authenticated && status.isAdmin;
}

export async function setAdminSession(user?: Partial<AdminAuthUser>): Promise<void> {
  const cookieStore = await cookies();
  const sessionPayload = {
    email: user?.email || 'admin@chronova.uz',
    name: user?.name || 'CHRONOVA Bosh Administrator',
    role: user?.role || 'admin',
    timestamp: Date.now(),
  };

  cookieStore.set(ADMIN_COOKIE_NAME, encodeURIComponent(JSON.stringify(sessionPayload)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

export function verifyAdminCredentials(email: string, pass: string): boolean {
  const validEmail = process.env.ADMIN_EMAIL || 'admin@chronova.uz';
  const validPass = process.env.ADMIN_PASSWORD || 'ChronovaAdmin2026!';

  return email.trim().toLowerCase() === validEmail.toLowerCase() && pass === validPass;
}
