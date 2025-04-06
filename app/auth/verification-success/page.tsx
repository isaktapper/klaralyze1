"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function VerificationSuccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is not verified, redirect to verify email page
    if (!user?.email_confirmed_at) {
      router.push('/auth/verify-email');
      return;
    }

    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email has been successfully verified. You will be redirected to the dashboard shortly.
          </p>
        </div>
      </div>
    </div>
  );
} 