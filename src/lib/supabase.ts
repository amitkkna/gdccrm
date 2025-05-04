import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials (from your .env.local file)
const supabaseUrl = 'https://wfieixqmazctqduzkzpd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaWVpeHFtYXpjdHFkdXprenBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMjU2MDIsImV4cCI6MjA2MTkwMTYwMn0.en0v1W9PbfWEU_gY4laZucHT6lsH6RBLCbyciRqU9pU';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to check if Supabase is properly configured
export const isSupabaseConfigured = () => true;
