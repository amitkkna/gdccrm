import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test connection to Supabase
    const { data, error } = await supabase.from('customers').select('*');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Connected to Supabase successfully',
      count: data ? data.length : 0,
      data: data ? data.slice(0, 5) : [] // Return only first 5 records for brevity
    });
  } catch (error: any) {
    console.error('Error testing Supabase connection:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to connect to Supabase'
    }, { status: 500 });
  }
}
