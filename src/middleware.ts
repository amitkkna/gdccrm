import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  try {
    // Check if we're in a Netlify environment
    const isNetlify = request.headers.get('host')?.includes('netlify.app') ||
                      process.env.NEXT_PUBLIC_NETLIFY === 'true';

    // For Netlify deployments, we'll skip auth checks for now to make debugging easier
    if (isNetlify) {
      console.log('Netlify environment detected, skipping auth checks');
      return NextResponse.next();
    }

    // Get Supabase URL and key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase is not configured, allow access to all routes
    if (!supabaseUrl || !supabaseKey || !supabaseUrl.startsWith('http')) {
      console.log('Supabase not configured, skipping auth checks');
      return NextResponse.next();
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Get the session from the request cookie
    const { data: { session } } = await supabase.auth.getSession();

    // Log the auth state for debugging
    console.log('Auth state:', {
      hasSession: !!session,
      path: request.nextUrl.pathname
    });

    // If there's no session and the user is trying to access a protected route
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
      console.log('No session, redirecting to login');
      const redirectUrl = new URL('/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session and the user is trying to access the login page
    if (session && request.nextUrl.pathname === '/login') {
      console.log('Session exists, redirecting to dashboard');
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('Error in middleware:', error);
    // On error, we'll allow the request to proceed
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
};
