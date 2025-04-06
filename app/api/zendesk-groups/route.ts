import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Handle GET requests for zendesk groups
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
      return NextResponse.json(
        { error: 'Zendesk not connected' },
        { status: 400 }
      );
    }

    console.log('Fetching Zendesk groups from domain:', zendesk_domain);
    
    // Fetch groups from Zendesk
    const auth = Buffer.from(`${zendesk_email}/token:${zendesk_api_key}`).toString('base64');
    
    const response = await fetch(`https://${zendesk_domain}.zendesk.com/api/v2/groups.json`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Zendesk API error:', errorData);
      return NextResponse.json(
        { error: `Failed to fetch groups: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Successfully retrieved groups:', data.groups?.length || 0);
    
    // Only return essential group data
    return NextResponse.json({
      groups: Array.isArray(data.groups) ? data.groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description || '',
      })) : []
    });
  } catch (error) {
    console.error('Error fetching Zendesk groups:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Zendesk groups',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { domain, subdomain, email, apiKey } = requestData;
    
    // Use either domain or subdomain, giving preference to domain if both are provided
    const domainValue = domain || subdomain || '';

    // Validate inputs
    if (!domainValue || !email || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Clean domain (remove https:// and trailing slashes if present)
    const cleanDomain = domainValue.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Further clean domain by removing .zendesk.com if it exists
    const domainForUrl = cleanDomain.replace(/\.zendesk\.com$/, '');

    // Verify authentication
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

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Fetch Zendesk groups
    try {
      console.log('Fetching Zendesk groups from:', {
        url: `https://${domainForUrl}.zendesk.com/api/v2/groups.json`,
        email
      });

      const auth = Buffer.from(`${email}/token:${apiKey}`).toString('base64');
      const response = await fetch(`https://${domainForUrl}.zendesk.com/api/v2/groups.json`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to fetch groups:', {
          status: response.status,
          text: responseText
        });
        return NextResponse.json(
          { 
            error: 'Failed to fetch Zendesk groups',
            details: responseText
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Successfully fetched groups, count:', data.groups?.length);

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      console.error('Error fetching Zendesk groups:', error);
      return NextResponse.json(
        { 
          error: 'Error fetching Zendesk groups',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 