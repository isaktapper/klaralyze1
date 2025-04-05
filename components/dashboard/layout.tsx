"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  LifeBuoy,
  LineChart,
  Menu,
  MessageSquare,
  Package,
  PanelLeft,
  Settings,
  Users,
  X,
  Lightbulb,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Tickets",
      href: "/dashboard/tickets",
      icon: MessageSquare,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: LineChart,
    },
    {
      title: "Insights",
      href: "/dashboard/insights",
      icon: Lightbulb,
    },
    {
      title: "Teams",
      href: "/dashboard/teams",
      icon: Users,
    },
    {
      title: "Knowledge Base",
      href: "/dashboard/knowledge-base",
      icon: Package,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help & Support",
      href: "/dashboard/support",
      icon: LifeBuoy,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-background transition-all duration-300 lg:static",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center space-x-2">
            <LineChart className="h-6 w-6 text-primary" />
            <span className={cn("font-bold transition-all", !isSidebarOpen && "lg:hidden")}>
              Klaralyze
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                  !isSidebarOpen && "lg:justify-center lg:px-2"
                )}
              >
                <route.icon className="h-4 w-4" />
                <span className={cn("transition-all", !isSidebarOpen && "lg:hidden")}>
                  {route.title}
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10">
              <span className="flex h-full w-full items-center justify-center text-xs font-medium">
                JD
              </span>
            </div>
            <div className={cn("flex flex-col", !isSidebarOpen && "lg:hidden")}>
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">john@example.com</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto p-4 transition-all duration-300",
        isSidebarOpen ? "lg:ml-0" : "lg:ml-0"
      )}>
        {children}
      </main>
    </div>
  );
} 