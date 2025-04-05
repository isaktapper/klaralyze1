"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LineChart, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      isScrolled ? "bg-white/60 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <LineChart className={`h-8 w-8 ${isScrolled ? "text-[#1E88E5]" : "text-[#1E88E5]"}`} />
              <span className={`text-xl font-bold ${isScrolled ? "text-gray-900" : "text-white"}`}>
                Klaralyze
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className={`${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}>
              Features
            </Link>
            <Link href="#how-it-works" className={`${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}>
              How it Works
            </Link>
            <Link href="#pricing" className={`${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-300 hover:text-white"}`}>
              Pricing
            </Link>
            <Link href="/login">
              <Button variant={isScrolled ? "outline" : "secondary"} className="mr-2">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">Get Started</Button>
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
          <div className="md:hidden py-4 bg-white/95 backdrop-blur-md rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button className="w-full bg-[#1E88E5] hover:bg-[#1976D2]">Get Started</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}