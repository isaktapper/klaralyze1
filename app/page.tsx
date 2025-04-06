'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-8 flex items-center justify-between border-b">
        <div className="text-2xl font-bold">Klaralyze</div>
        <nav>
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get started</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Powerful analytics for your Zendesk data
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Get insights into your customer support performance with beautiful visualizations and actionable metrics.
        </p>
        <div className="space-x-4">
          <Link href="/signup">
            <Button size="lg">Start for free</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">Sign in</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}