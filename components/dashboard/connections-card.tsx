"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Link as LinkIcon, X } from "lucide-react";

export function ConnectionsCard() {
  const { user, updateUserMetadata, refreshUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [zendeskDomain, setZendeskDomain] = useState(user?.user_metadata?.zendesk_domain || "");
  const [zendeskEmail, setZendeskEmail] = useState(user?.user_metadata?.zendesk_email || "");
  const [zendeskApiKey, setZendeskApiKey] = useState(user?.user_metadata?.zendesk_api_key || "");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  const isZendeskConnected = Boolean(user?.user_metadata?.zendesk_connected);

  const handleConnectZendesk = async () => {
    if (!zendeskDomain || !zendeskEmail || !zendeskApiKey) {
      toast.error("Please fill in all Zendesk fields");
      return;
    }

    setIsConnecting(true);
    try {
      // Test the connection first
      const checkResponse = await fetch("/api/verify-zendesk-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: zendeskDomain,
          email: zendeskEmail,
          apiKey: zendeskApiKey,
        }),
      });

      if (!checkResponse.ok) {
        const error = await checkResponse.json();
        throw new Error(error.message || "Failed to verify Zendesk credentials");
      }

      // If verification successful, update user metadata
      await updateUserMetadata({
        zendesk_domain: zendeskDomain,
        zendesk_email: zendeskEmail,
        zendesk_api_key: zendeskApiKey,
        zendesk_connected: true,
      });

      await refreshUser();
      toast.success("Zendesk connected successfully!");
    } catch (error) {
      console.error("Error connecting Zendesk:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect Zendesk");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectZendesk = async () => {
    try {
      await updateUserMetadata({
        zendesk_domain: "",
        zendesk_email: "",
        zendesk_api_key: "",
        zendesk_connected: false,
      });
      
      await refreshUser();
      setZendeskDomain("");
      setZendeskEmail("");
      setZendeskApiKey("");
      toast.success("Zendesk disconnected");
    } catch (error) {
      console.error("Error disconnecting Zendesk:", error);
      toast.error("Failed to disconnect Zendesk");
    }
  };

  const handleCheckStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const response = await fetch("/api/check-zendesk-status");
      const data = await response.json();
      
      if (data.connected) {
        toast.success("Zendesk connection is active!");
      } else {
        toast.error("Zendesk connection failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error checking Zendesk status:", error);
      toast.error("Failed to check Zendesk status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <LinkIcon className="mr-2 h-5 w-5" />
          Connections
        </CardTitle>
        <CardDescription>
          Manage your external service connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Zendesk</h3>
              <p className="text-sm text-muted-foreground">
                {isZendeskConnected 
                  ? `Connected to ${user?.user_metadata?.zendesk_domain}.zendesk.com` 
                  : "Zendesk integration is not configured"}
              </p>
            </div>
            <div className="flex items-center">
              {isZendeskConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-green-500 mr-2">Connected</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCheckStatus}
                    disabled={isCheckingStatus}
                  >
                    Check Status
                  </Button>
                </>
              ) : (
                <X className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                {isZendeskConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>

          {!isZendeskConnected && (
            <div className="space-y-3">
              <div className="grid gap-2">
                <Label htmlFor="zendesk-domain">Zendesk Domain</Label>
                <div className="flex">
                  <Input
                    id="zendesk-domain"
                    placeholder="yourdomain"
                    className="rounded-r-none"
                    value={zendeskDomain}
                    onChange={(e) => setZendeskDomain(e.target.value)}
                  />
                  <div className="flex items-center border border-l-0 border-input bg-muted px-3 rounded-r-md text-sm text-muted-foreground">
                    .zendesk.com
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zendesk-email">Email</Label>
                <Input
                  id="zendesk-email"
                  type="email"
                  placeholder="you@example.com"
                  value={zendeskEmail}
                  onChange={(e) => setZendeskEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zendesk-api-key">API Token</Label>
                <Input
                  id="zendesk-api-key"
                  type="password"
                  placeholder="API Token from Zendesk Admin"
                  value={zendeskApiKey}
                  onChange={(e) => setZendeskApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can find your API token in the Zendesk Admin panel under Settings &gt; API
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {isZendeskConnected ? (
          <Button variant="destructive" onClick={handleDisconnectZendesk}>
            Disconnect Zendesk
          </Button>
        ) : (
          <Button
            onClick={handleConnectZendesk}
            disabled={isConnecting || !zendeskDomain || !zendeskEmail || !zendeskApiKey}
          >
            {isConnecting ? "Connecting..." : "Connect Zendesk"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 