import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { ZendeskAPI } from '@/lib/zendesk';

export async function POST(request: Request) {
  try {
    // Get the connection type from the request body
    const { connectionType } = await request.json();
    
    if (!connectionType) {
      return NextResponse.json(
        { error: 'Missing connection type' },
        { status: 400 }
      );
    }

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

    if (connectionType === 'zendesk') {
      // Get Zendesk credentials from user metadata
      const { zendesk_domain, zendesk_email, zendesk_api_key } = session.user.user_metadata || {};

      if (!zendesk_domain || !zendesk_email || !zendesk_api_key) {
        return NextResponse.json(
          { 
            status: 'disconnected',
            message: 'Zendesk credentials not found'
          }
        );
      }

      try {
        // Test the Zendesk connection
        const zendesk = new ZendeskAPI(zendesk_domain, zendesk_email, zendesk_api_key);
        const connectionValid = await zendesk.verifyCredentials();
        
        if (connectionValid) {
          // Update user metadata to mark Zendesk as connected
          await supabase.auth.updateUser({
            data: { zendesk_connected: true }
          });
          
          return NextResponse.json({
            status: 'connected',
            message: 'Zendesk connection is valid',
            details: {
              domain: zendesk_domain,
              email: zendesk_email
            }
          });
        } else {
          // Update user metadata to mark Zendesk as disconnected
          await supabase.auth.updateUser({
            data: { zendesk_connected: false }
          });
          
          return NextResponse.json({
            status: 'error',
            message: 'Zendesk credentials are invalid'
          });
        }
      } catch (error) {
        console.error('Error checking Zendesk connection:', error);
        return NextResponse.json({
          status: 'error',
          message: 'Error checking Zendesk connection',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // For other connection types
    return NextResponse.json(
      { 
        status: 'error',
        message: `Connection type '${connectionType}' not supported` 
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error checking connection:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 