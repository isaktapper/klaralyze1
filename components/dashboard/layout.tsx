"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, User, LogOut, Users, LayoutDashboard, BarChart3, Lightbulb } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "group fixed inset-y-0 left-0 z-50 w-20 bg-gradient-to-b from-blue-600 to-blue-800 transition-all duration-300",
          isGuiding ? "!w-64" : "hover:w-64"
        )} 
        data-tour="nav"
      >
        <div className="flex h-16 items-center bg-[#1a237e] pl-6">
          <Link href="/" className="flex items-center">
            <div className="relative flex items-center">
              {/* Icon - Always visible, larger than nav icons */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <Image
                  src="/klaralyze_icon.svg"
                  alt="Klaralyze"
                  width={32}
                  height={32}
                  className="object-contain brightness-0 invert"
                  priority
                />
              </div>
              {/* Text - Revealed on hover */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ml-4",
                isGuiding ? "!w-40 opacity-100" : "w-0 group-hover:w-40"
              )}>
                <div className="whitespace-nowrap">
                  <span className="text-white text-xl font-medium">klaralyze</span>
                </div>
              </div>
            </div>
          </Link>
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
              <div className="h-8 w-8 shrink-0 rounded-full bg-blue-700/50" />
              <div className={cn(
                "transition-opacity duration-300 ml-4 min-w-0",
                isGuiding ? "!opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-blue-100 truncate">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
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