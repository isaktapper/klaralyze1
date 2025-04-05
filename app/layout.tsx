import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import ClientProviders from '@/components/client-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Klaralyze - Web Analytics Platform',
  description: 'Privacy-focused web analytics for modern businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "min-h-screen bg-white antialiased")}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}