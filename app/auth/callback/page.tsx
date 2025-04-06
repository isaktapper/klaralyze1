"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      
      if (!code) {
        console.error('No code provided');
        toast.error('Verification failed. Please try again.');
        router.push('/auth/sign-in');
        return;
      }

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error('No session returned');
        }

        // Redirect to verification success page
        router.push('/auth/verification-success');
      } catch (error) {
        console.error('Error:', error);
        toast.error('Verification failed. Please try again.');
        router.push('/auth/sign-in');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <h1 className="text-2xl font-semibold text-gray-900">Verifying your email...</h1>
        <p className="text-gray-600">Please wait while we complete the verification process.</p>
      </div>
    </div>
  );
} 