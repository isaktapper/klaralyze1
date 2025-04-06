"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo'
import { SignUpSteps } from '@/components/auth/signup-steps'

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/signup');
  }, [router]);

  return null;
} 