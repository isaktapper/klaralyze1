"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-8">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Check your email
          </h1>
          
          <p className="text-lg text-gray-400 mb-6">
            We sent a verification link to:
          </p>
          
          <div className="bg-white/5 rounded-lg p-4 mb-8">
            <p className="text-lg font-medium text-white">
              {email}
            </p>
          </div>

          <div className="space-y-4 text-gray-400">
            <p>
              Click the link in the email to verify your account and complete the signup process.
            </p>
            <p>
              If you don't see the email, check your spam folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 