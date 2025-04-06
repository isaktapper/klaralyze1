import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { domain, email, apiKey } = await request.json();

    // Validate inputs
    if (!domain || !email || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean domain (remove https:// and trailing slashes if present)
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    // Test Zendesk credentials by making a request to the API
    try {
      const auth = Buffer.from(`${email}/token:${apiKey}`).toString('base64');
      console.log('Testing Zendesk connection:', {
        url: `https://${cleanDomain}/api/v2/users/me.json`,
        email,
        domain: cleanDomain
      });

      const testResponse = await fetch(`https://${cleanDomain}/api/v2/users/me.json`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
      });

      const responseData = await testResponse.text();
      console.log('Zendesk API Response:', {
        status: testResponse.status,
        statusText: testResponse.statusText,
        response: responseData
      });

      if (!testResponse.ok) {
        return NextResponse.json(
          { 
            error: 'Invalid Zendesk credentials',
            details: responseData
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error('Zendesk API Error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to connect to Zendesk. Please check your domain and credentials.',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 401 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user's session from cookie
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('sb-access-token')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user from session
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(sessionCookie);

    if (getUserError || !user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Store Zendesk credentials in user metadata
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          zendesk_connected: true,
          zendesk_domain: cleanDomain,
          zendesk_email: email,
          // Store API key encrypted in production
          zendesk_api_key: apiKey,
        },
      }
    );

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      return NextResponse.json(
        { error: 'Failed to save Zendesk credentials' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Zendesk connected successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error connecting to Zendesk:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 