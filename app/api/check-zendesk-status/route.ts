import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ZendeskAPI } from '@/lib/zendesk';

export async function GET(request: Request) {
  try {
    // Authentication check via Supabase
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get Zendesk credentials from user metadata
    const { zendesk_domain, zendesk_email, zendesk_api_key } = session.user.user_metadata || {};

    if (!zendesk_domain || !zendesk_email || !zendesk_api_key) {
      return NextResponse.json({ connected: false, message: 'Zendesk credentials not found' });
    }

    // Initialize Zendesk API client
    const zendesk = new ZendeskAPI(zendesk_domain, zendesk_email, zendesk_api_key);

    // Verify connection
    const isConnected = await zendesk.verifyCredentials();

    return NextResponse.json({
      connected: isConnected,
      message: isConnected ? 'Successfully connected to Zendesk' : 'Failed to connect to Zendesk'
    });
  } catch (error) {
    console.error('Error checking Zendesk status:', error);
    return NextResponse.json(
      { 
        connected: false,
        error: 'Failed to check Zendesk connection',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 