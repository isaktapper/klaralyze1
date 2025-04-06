"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function VerificationSuccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50;

      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#60A5FA', '#34D399'],
      });

      confetti({
        particleCount,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors: ['#4F46E5', '#60A5FA', '#34D399'],
      });

      confetti({
        particleCount,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors: ['#4F46E5', '#60A5FA', '#34D399'],
      });
    }, 250);

    // Show success toast
    toast.success('Email verified successfully! 🎉', {
      duration: 5000,
    });

    // Redirect to dashboard after animation
    const redirectTimer = setTimeout(() => {
      router.push('/dashboard');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-2xl transform transition-all animate-fade-up">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 animate-fade-up">
            You're Verified! 🎉
          </h2>
          <p className="mt-4 text-xl text-gray-600 animate-fade-up delay-200">
            Welcome to Klaralyze
          </p>
          <p className="mt-2 text-gray-500 animate-fade-up delay-300">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
} 