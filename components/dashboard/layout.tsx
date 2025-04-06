"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, User, LogOut, Users, LayoutDashboard, BarChart3, Lightbulb, MessageSquare, Zap, Mail, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from '@/lib/auth';
import { Logo } from "@/components/ui/Logo";
import { SignOutButton } from '@/components/dashboard/sign-out-button';

const navigation = [
  { name: "Analytics", href: "/dashboard", icon: BarChart3 },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
  { name: "Team", href: "/dashboard/team", icon: Users },
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
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-16 bg-gray-900 transition-all duration-200 ease-in-out",
            isHovered ? "w-64" : "w-16"
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex h-16 items-center justify-center border-b border-gray-800">
            <Image
              src="/logo.svg"
              alt="Klaralyze"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            {isHovered && (
              <span className="ml-2 text-white font-semibold">Klaralyze</span>
            )}
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => router.push(item.href)}
                          className={cn(
                            isActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full transition-colors duration-200'
                          )}
                        >
                          <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                          {isHovered && <span>{item.name}</span>}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={() => signOut()}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white w-full"
                >
                  <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {isHovered && <span>Sign out</span>}
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto bg-background pl-16">
          {children}
        </div>
      </div>
    </div>
  );
} 