"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Settings, HelpCircle, User, LogOut, Users, LayoutDashboard, BarChart3, Lightbulb } from "lucide-react";
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
  const [isHovered, setIsHovered] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 z-50 flex flex-col bg-blue-800 transition-all duration-300",
          isGuiding || isHovered ? "w-64" : "w-20"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-tour="nav"
      >
        <Link href="/" className="flex h-16 shrink-0 items-center px-6 bg-[#1a237e]">
          <div className="relative flex items-center">
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
            <span className={cn(
              "ml-4 text-xl font-medium text-white transition-all duration-300",
              isGuiding || isHovered ? "opacity-100" : "opacity-0"
            )}>
              klaralyze
            </span>
          </div>
        </Link>

        <nav className="mt-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              data-tour={item.href === "/dashboard" ? "overview" : item.href === "/dashboard/dashboards" ? "dashboards" : "insights"}
              className={cn(
                "flex h-12 items-center pl-6 text-sm font-medium transition-colors relative",
                pathname === item.href
                  ? "bg-blue-700/50 text-white"
                  : "text-white hover:bg-blue-700/50 hover:text-white"
              )}
            >
              <div className="w-8 flex items-center justify-center">
                <item.icon className="h-5 w-5 shrink-0" />
              </div>
              <span className={cn(
                "ml-4 transition-all duration-300",
                isGuiding || isHovered ? "opacity-100" : "opacity-0"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pb-4">
          <div>
            {bottomNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex h-12 items-center pl-6 text-sm font-medium transition-colors relative",
                  pathname === item.href
                    ? "bg-blue-700/50 text-white"
                    : "text-white hover:bg-blue-700/50 hover:text-white"
                )}
              >
                <div className="w-8 flex items-center justify-center">
                  <item.icon className="h-5 w-5 shrink-0" />
                </div>
                <span className={cn(
                  "ml-4 transition-all duration-300",
                  isGuiding || isHovered ? "opacity-100" : "opacity-0"
                )}>
                  {item.name}
                </span>
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className={cn(
                "flex h-12 items-center pl-6 text-sm font-medium transition-colors relative w-full",
                "text-white hover:bg-blue-700/50 hover:text-white"
              )}
            >
              <div className="w-8 flex items-center justify-center">
                <LogOut className="h-5 w-5 shrink-0" />
              </div>
              <span className={cn(
                "ml-4 transition-all duration-300",
                isGuiding || isHovered ? "opacity-100" : "opacity-0"
              )}>
                Sign Out
              </span>
            </button>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4 px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 shrink-0 rounded-full bg-blue-700/50 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className={cn(
                "ml-4 min-w-0 transition-all duration-300",
                isGuiding || isHovered ? "opacity-100" : "opacity-0"
              )}>
                <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || 'User'}</p>
                <p className="text-xs text-blue-100 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isGuiding || isHovered ? "pl-64" : "pl-20"
      )}>
        {children}
      </div>
    </div>
  );
} 