import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all enquiries from Supabase
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      count: data ? data.length : 0,
      data: data || []
    });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to fetch enquiries'
    }, { status: 500 });
  }
}
