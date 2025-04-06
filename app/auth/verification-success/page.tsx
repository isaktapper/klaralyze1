"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

export default function VerificationSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Show success toast
    toast.success("Email verified successfully!");

    // Redirect to dashboard after 4 seconds
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="animate-bounce mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Email Verified!
        </h1>
        
        <p className="text-lg text-gray-400 mb-8">
          Your account has been verified successfully. Redirecting you to the dashboard...
        </p>

        <div className="relative">
          <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full animate-progress" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s linear;
        }
      `}</style>
    </div>
  );
} 