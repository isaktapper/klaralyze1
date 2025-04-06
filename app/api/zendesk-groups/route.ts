import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
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
        url: `https://${cleanDomain}/api/v2/groups.json`,
        email
      });

      const auth = Buffer.from(`${email}/token:${apiKey}`).toString('base64');
      const response = await fetch(`https://${cleanDomain}/api/v2/groups.json`, {
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