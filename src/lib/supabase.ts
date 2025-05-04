import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables or use hardcoded values as fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfieixqmazctqduzkzpd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaWVpeHFtYXpjdHFkdXprenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMjU2MDIsImV4cCI6MjA2MTkwMTYwMn0.en0v1W9PbfWEU_gY4laZucHT6lsH6RBLCbyciRqU9pU';

// Log the Supabase configuration for debugging
console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  environment: process.env.NODE_ENV
});

// Create a Supabase client with options for better browser compatibility
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'gdccrm-auth-token',
  }
});

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl.startsWith('http');
};
