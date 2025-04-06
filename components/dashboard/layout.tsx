"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, User, LogOut, Users, LayoutDashboard, BarChart3, Lightbulb, MessageSquare, Zap, Mail, X, Ticket } from "lucide-react";
import Image from "next/image";
import { useAuth } from '@/lib/auth';
import { Logo } from "@/components/ui/Logo";
import { SignOutButton } from '@/components/dashboard/sign-out-button';

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Team", href: "/dashboard/invite", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const bottomNavigation = [
  { name: "Invite Coworkers", href: "/dashboard/invite", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children, isGuiding }: { children: React.ReactNode, isGuiding?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, isVerified } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isVerified && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </span>
                <p className="ml-3 font-medium text-blue-900">
                  <span className="md:hidden">Please verify your email</span>
                  <span className="hidden md:inline">
                    Please check your email and verify your account to unlock all features
                  </span>
                </p>
              </div>
              <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                <button
                  type="button"
                  className="-mr-1 flex p-2 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:-mr-2"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-6 w-6 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div 
          className={cn(
            "fixed left-0 top-0 z-50 h-screen transition-all duration-300",
            isGuiding || isHovered ? "w-64" : "w-16",
            "bg-[#026EE6]"
          )}
          onMouseEnter={() => !isGuiding && setIsHovered(true)}
          onMouseLeave={() => !isGuiding && setIsHovered(false)}
        >
          {/* Logo */}
          <div className={cn(
            "h-16 flex items-center transition-all duration-300",
            isGuiding || isHovered ? "px-4" : "justify-center"
          )}>
            <Link href="/dashboard" className="flex items-center tour-logo">
              <Image
                src="/klaralyze_icon.svg"
                alt="Klaralyze Logo"
                width={32}
                height={32}
                className="transition-all duration-300"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <Image
                src="/klaralyze_text.svg"
                alt="Klaralyze"
                width={120}
                height={24}
                className={cn(
                  "ml-2 transition-all duration-300",
                  isGuiding || isHovered ? "opacity-100" : "opacity-0 w-0"
                )}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="mt-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-tour={item.name.toLowerCase()}
                  className={cn(
                    "flex items-center transition-colors hover:text-white hover:bg-white/10",
                    isActive ? "text-white bg-white/10" : "text-white/70",
                    isGuiding || isHovered ? "px-4 py-3" : "justify-center py-3",
                    `tour-${item.name.toLowerCase()}`
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-300",
                    isGuiding || isHovered ? "mr-3" : ""
                  )} />
                  <span className={cn(
                    "text-sm font-medium transition-all duration-300",
                    isGuiding || isHovered ? "opacity-100" : "opacity-0 w-0"
                  )}>
                    {item.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto mb-4 px-4">
            <SignOutButton isExpanded={isGuiding || isHovered} />
          </div>
        </div>

        {/* Main content */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          isGuiding || isHovered ? "ml-64" : "ml-16"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
} 