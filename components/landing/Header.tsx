"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Image
              src="/klaralyze_logo.svg"
              alt="Klaralyze"
              width={140}
              height={32}
              className={cn(
                "transition-all duration-300",
                isScrolled ? "" : "brightness-0 invert"
              )}
              priority
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className={`${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}>
              Features & Pricing
            </Link>
            <Link href="/how-it-works" className={`${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}>
              How it Works
            </Link>
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </nav>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className={`h-6 w-6 ${isScrolled ? "text-gray-900" : "text-white"}`} />
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Features & Pricing</Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">Log In</Button>
              </Link>
              <Link href="/register" className="w-full">
                <Button className="w-full bg-[#026EE6] hover:bg-[#0256B4]">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}