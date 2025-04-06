"use client";

import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConnectionsCard } from "@/components/dashboard/connections-card";

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<Array<{
    id: string;
    name: string;
    status: "connected" | "disconnected" | "error";
    lastUpdated?: Date;
    details?: string;
  }>>([]);

  // Fetch and set connection statuses from user data
  useEffect(() => {
    if (user) {
      const connectionsList = [];
      
      // Check Zendesk connection
      const zendeskConnected = user.user_metadata?.zendesk_connected || false;
      const zendeskDomain = user.user_metadata?.zendesk_domain;
      const zendeskEmail = user.user_metadata?.zendesk_email;
      
      connectionsList.push({
        id: "zendesk",
        name: "Zendesk",
        status: zendeskConnected ? ("connected" as const) : ("disconnected" as const),
        details: zendeskConnected 
          ? `Connected with ${zendeskEmail} to ${zendeskDomain}`
          : "Zendesk integration is not configured",
        lastUpdated: zendeskConnected ? new Date() : undefined,
      });
      
      setConnections(connectionsList);
    }
  }, [user]);

  const verifyConnection = async (id: string) => {
    setLoading(true);
    try {
      // In a real implementation, this would verify the connection is working
      // For now, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${id} connection verified successfully`);
    } catch (error) {
      toast.error(`Failed to verify ${id} connection`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Add the ConnectionsCard at the top */}
        <ConnectionsCard connections={connections} />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input 
                  defaultValue={user?.user_metadata?.full_name} 
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input 
                  value={user?.email} 
                  disabled 
                  className="bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input 
                  defaultValue={user?.user_metadata?.job_title}
                  placeholder="Your job title"
                />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Organization Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Configure your organization preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input 
                  defaultValue={user?.user_metadata?.company}
                  placeholder="Your company name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Size</label>
                <Input 
                  defaultValue={user?.user_metadata?.company_size}
                  placeholder="Number of employees"
                />
              </div>
              <Button>Update Organization</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          {/* API Settings */}
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Manage your API keys and integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 