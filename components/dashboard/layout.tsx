"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, User, LogOut, Users, LayoutDashboard, BarChart3, Lightbulb } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Dashboards", href: "/dashboard/dashboards", icon: BarChart3 },
  { name: "Insights", href: "/dashboard/insights", icon: Lightbulb },
];

const bottomNavigation = [
  { name: "Invite Coworkers", href: "/dashboard/invite", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/support", icon: HelpCircle },
];

export default function DashboardLayout({ children, isGuiding }: { children: React.ReactNode, isGuiding?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 z-50 flex w-20 flex-col bg-blue-800 transition-all duration-300",
        isGuiding ? "w-64" : "w-20"
      )}>
        <div className="flex h-16 shrink-0 items-center justify-center">
          <Logo className="h-8 w-8" />
        </div>

        <nav className="mt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              data-tour={item.href === "/dashboard" ? "overview" : item.href === "/dashboard/dashboards" ? "dashboards" : "insights"}
              className={cn(
                "group/item flex h-12 items-center pl-6 text-sm font-medium transition-colors relative",
                pathname === item.href
                  ? "bg-blue-700/50 text-white"
                  : "text-white hover:bg-blue-700/50 hover:text-white"
              )}
            >
              <div className="w-8 flex items-center justify-center">
                <item.icon className="h-5 w-5 shrink-0" />
              </div>
              <span className={cn(
                "transition-opacity duration-300 absolute left-[56px]",
                isGuiding ? "!opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 pb-4">
          <div>
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group/item flex h-12 items-center pl-6 text-sm font-medium transition-colors relative",
                  pathname === item.href
                    ? "bg-blue-700/50 text-white"
                    : "text-white hover:bg-blue-700/50 hover:text-white"
                )}
              >
                <div className="w-8 flex items-center justify-center">
                  <item.icon className="h-5 w-5 shrink-0" />
                </div>
                <span className={cn(
                  "transition-opacity duration-300 absolute left-[56px]",
                  isGuiding ? "!opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center pl-6">
              <div className="h-8 w-8 shrink-0 rounded-full bg-blue-700/50 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className={cn(
                "transition-opacity duration-300 ml-4 min-w-0",
                isGuiding ? "!opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs text-blue-100 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        isGuiding ? "pl-64" : "pl-20"
      )}>
        {children}
      </div>
    </div>
  );
} 