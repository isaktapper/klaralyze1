"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Link as LinkIcon, X, Loader2 } from "lucide-react";

export function ConnectionsCard() {
  const { user, updateUserMetadata, refreshUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [zendeskDomain, setZendeskDomain] = useState("");
  const [zendeskEmail, setZendeskEmail] = useState("");
  const [zendeskApiKey, setZendeskApiKey] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  // Separate state to track connection status to avoid UI flicker during updates
  const [isZendeskConnected, setIsZendeskConnected] = useState(false);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user?.user_metadata) {
      setZendeskDomain(user.user_metadata.zendesk_domain || "");
      setZendeskEmail(user.user_metadata.zendesk_email || "");
      setZendeskApiKey(user.user_metadata.zendesk_api_key || "");
      setIsZendeskConnected(Boolean(user.user_metadata.zendesk_connected));
    } else {
      setZendeskDomain("");
      setZendeskEmail("");
      setZendeskApiKey("");
      setIsZendeskConnected(false);
    }
  }, [user]);

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

      // Update local connection state immediately for better UX
      setIsZendeskConnected(true);
      
      // Then refresh the user data from the server
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
    setIsDisconnecting(true);
    try {
      console.log("Disconnecting Zendesk...");
      
      // Update local state immediately for better UX
      setIsZendeskConnected(false);
      
      // Clear Zendesk related metadata - use empty strings instead of null
      // as some implementations have issues with null values
      const result = await updateUserMetadata({
        zendesk_domain: "",
        zendesk_email: "",
        zendesk_api_key: "",
        zendesk_connected: false,
      });
      
      console.log("Metadata update result:", result);
      
      // Clear local state
      setZendeskDomain("");
      setZendeskEmail("");
      setZendeskApiKey("");
      
      // Force refresh user data from server
      await refreshUser();
      
      toast.success("Zendesk disconnected successfully");
      console.log("Zendesk disconnected successfully");
    } catch (error) {
      console.error("Error disconnecting Zendesk:", error);
      toast.error("Failed to disconnect Zendesk");
      
      // Restore connection state if disconnection fails
      setIsZendeskConnected(Boolean(user?.user_metadata?.zendesk_connected));
    } finally {
      setIsDisconnecting(false);
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
                  ? `Connected to ${user?.user_metadata?.zendesk_domain || zendeskDomain}.zendesk.com` 
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
                    {isCheckingStatus ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Status"
                    )}
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
          <Button 
            variant="destructive" 
            onClick={handleDisconnectZendesk}
            disabled={isDisconnecting}
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              "Disconnect Zendesk"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleConnectZendesk}
            disabled={isConnecting || !zendeskDomain || !zendeskEmail || !zendeskApiKey}
          >
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect Zendesk
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 