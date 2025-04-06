import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { subdomain, email, apiKey, groups } = requestData;
    
    // Validate required fields
    if (!subdomain || !email || !apiKey || !groups || groups.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    console.log('Starting import process with groups:', groups);
    
    // Get the user from Supabase
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
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return NextResponse.json({ 
        error: 'Authentication error' 
      }, { status: 401 });
    }
    
    // Store the Zendesk credentials securely in user metadata
    // In a production environment, consider encrypting sensitive data
    const { error: updateError } = await supabase.auth.updateUser({
      data: { 
        zendesk_connected: true,
        zendesk_subdomain: subdomain,
        zendesk_email: email,
        // Don't store API key in metadata for security reasons
        // We could use a more secure storage solution for this
        zendesk_groups: groups
      }
    });
    
    if (updateError) {
      console.error('Failed to update user metadata:', updateError);
      return NextResponse.json({ 
        error: 'Failed to save connection settings' 
      }, { status: 500 });
    }
    
    // In a real implementation, we would:
    // 1. Queue a background job to import data from Zendesk
    // 2. Track the import progress in a database
    // 3. Set up webhooks to keep data in sync
    
    // For now, simulate an import process
    console.log('Import process started for user:', user.id);
    
    return NextResponse.json({ 
      success: true,
      message: 'Import process started successfully' 
    });
    
  } catch (error) {
    console.error('Import process error:', error);
    return NextResponse.json({ 
      error: 'Failed to start import process' 
    }, { status: 500 });
  }
} 