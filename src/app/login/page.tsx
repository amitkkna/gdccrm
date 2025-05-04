'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, configured } = useAuth();
  const router = useRouter();

  // Check if we're in a Netlify environment
  const isNetlify = typeof window !== 'undefined' &&
    (window.location.hostname.includes('netlify.app') ||
     process.env.NEXT_PUBLIC_NETLIFY === 'true');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting to sign in with:', { email, isNetlify });

      // Add a small delay to ensure Supabase connection is established
      await new Promise(resolve => setTimeout(resolve, 500));

      await signIn(email, password);

      // The redirect is now handled in the signIn function
      // We don't need to call router.push here
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error?.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div>
          <h1 className="text-center text-3xl font-bold">CRM Login</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>

        {!configured ? (
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-700">
              Supabase is not configured. Please update your .env.local file with valid Supabase credentials.
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
              NEXT_PUBLIC_SUPABASE_URL=your-supabase-url<br />
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
            </pre>
          </div>
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : null}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={!configured}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                disabled={!configured}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!configured || loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {isNetlify && (
            <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
              <p className="font-medium">Demo Credentials:</p>
              <p>Email: admin@example.com</p>
              <p>Password: password123</p>
            </div>
          )}

          {!configured && (
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>For demo purposes, you can also use the dashboard without authentication:</p>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Go to Dashboard Demo
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
