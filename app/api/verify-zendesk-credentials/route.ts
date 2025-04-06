import { NextResponse } from 'next/server';
import { ZendeskAPI } from '@/lib/zendesk';

export async function POST(request: Request) {
  try {
    const { domain, email, apiKey } = await request.json();

    if (!domain || !email || !apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required parameters' 
        }, 
        { status: 400 }
      );
    }

    // Initialize Zendesk API client with provided credentials
    const zendesk = new ZendeskAPI(domain, email, apiKey);

    // Test the connection
    const isValid = await zendesk.verifyCredentials();

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Zendesk credentials verified successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to connect to Zendesk with provided credentials'
        }, 
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying Zendesk credentials:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      }, 
      { status: 500 }
    );
  }
} 