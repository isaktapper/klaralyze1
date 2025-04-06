"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || type !== 'email') {
          setError('Invalid verification link');
          setVerifying(false);
          return;
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          setError(error.message);
          setVerifying(false);
          return;
        }

        toast.success('Email verified successfully!');
        router.push('/dashboard');
      } catch (err) {
        setError('An error occurred during verification');
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {verifying ? 'Verifying your email...' : error ? 'Verification failed' : 'Email verified!'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {verifying 
              ? 'Please wait while we verify your email address...'
              : error 
                ? error
                : 'You will be redirected to the dashboard shortly.'}
          </p>
        </div>
      </div>
    </div>
  );
} 