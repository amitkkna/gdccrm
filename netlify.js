// This file is used to configure Netlify deployment
// It's executed during the build process

// Set environment variables for Netlify
process.env.NETLIFY = 'true';
process.env.NEXT_PUBLIC_NETLIFY = 'true';

console.log('Netlify deployment configuration loaded');
console.log('Environment variables set:');
console.log('- NETLIFY:', process.env.NETLIFY);
console.log('- NEXT_PUBLIC_NETLIFY:', process.env.NEXT_PUBLIC_NETLIFY);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set (hidden for security)' : 'Not set');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden for security)' : 'Not set');
