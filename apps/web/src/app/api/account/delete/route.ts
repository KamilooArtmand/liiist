import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';

export async function POST(request: Request) {
  try {
    // In production, this would use Supabase SSR auth to verify the user
    // const authHeader = request.headers.get('Authorization');
    // const { data: { user } } = await supabase.auth.getUser(token);
    
    // Using a mock user ID for this architectural demonstration
    const mockUserId = '12345678-1234-1234-1234-123456789012';

    // Requires Service Role key to bypass RLS and update the profile
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // Schedule deletion for 30 days from now
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + 30);

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        is_deactivated: true,
        scheduled_deletion_date: deletionDate.toISOString(),
      })
      .eq('id', mockUserId);

    if (error) {
      console.error('Failed to queue account for deletion:', error);
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Account queued for deletion. Profile is now hidden.' 
    });

  } catch (error) {
    console.error('Deletion Queue API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process deletion request' },
      { status: 500 }
    );
  }
}
