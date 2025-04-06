"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        
        if (!code) {
          console.error('No code provided');
          toast.error('Invalid verification link');
          router.push('/');
          return;
        }

        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('Error exchanging code for session:', error);
          toast.error('Failed to verify email. Please try again.');
          router.push('/');
          return;
        }

        // Redirect to verification success page
        router.push('/auth/verification-success');
      } catch (error) {
        console.error('Error in callback:', error);
        toast.error('An error occurred during verification');
        router.push('/');
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-8"></div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Verifying your email...
          </h2>
          <p className="text-gray-400">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
} 