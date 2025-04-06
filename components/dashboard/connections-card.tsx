"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowRight, CheckCircle, Link as LinkIcon, X, Loader2, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ConnectionsCard() {
  const { user, updateUserMetadata, refreshUser } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [zendeskDomain, setZendeskDomain] = useState("");
  const [zendeskEmail, setZendeskEmail] = useState("");
  const [zendeskApiKey, setZendeskApiKey] = useState("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  
  // Zendesk connection options
  const [fetchAllTickets, setFetchAllTickets] = useState(true);
  const [importComments, setImportComments] = useState(true);
  const [ticketStatus, setTicketStatus] = useState<string>("all");
  const [syncInterval, setSyncInterval] = useState<string>("daily");
  
  // Separate state to track connection status to avoid UI flicker during updates
  const [isZendeskConnected, setIsZendeskConnected] = useState(false);
  
  // Set up console messages for debugging connection issues
  useEffect(() => {
    console.log("User metadata in effect:", user?.user_metadata);
    if (user?.user_metadata?.zendesk_connected) {
      console.log("Zendesk is connected according to metadata");
    } else {
      console.log("Zendesk is not connected according to metadata");
    }
  }, [user]);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user?.user_metadata) {
      setZendeskDomain(user.user_metadata.zendesk_domain || "");
      setZendeskEmail(user.user_metadata.zendesk_email || "");
      setZendeskApiKey(user.user_metadata.zendesk_api_key || "");
      setIsZendeskConnected(Boolean(user.user_metadata.zendesk_connected));
      
      // Restore preferences from user metadata if available
      setFetchAllTickets(user.user_metadata.zendesk_fetch_all_tickets !== false);
      setImportComments(user.user_metadata.zendesk_import_comments !== false);
      setTicketStatus(user.user_metadata.zendesk_ticket_status || "all");
      setSyncInterval(user.user_metadata.zendesk_sync_interval || "daily");
    } else {
      setZendeskDomain("");
      setZendeskEmail("");
      setZendeskApiKey("");
      setIsZendeskConnected(false);
      
      // Reset preferences to defaults
      setFetchAllTickets(true);
      setImportComments(true);
      setTicketStatus("all");
      setSyncInterval("daily");
    }
  }, [user]);

  const handleConnectZendesk = async () => {
    if (!zendeskDomain || !zendeskEmail || !zendeskApiKey) {
      toast.error("Please fill in all Zendesk fields");
      return;
    }

    setIsConnecting(true);
    try {
      console.log("Starting Zendesk connection process...");
      
      // Test the connection first
      console.log("Verifying Zendesk credentials...");
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
        console.error("Zendesk verification failed:", error);
        throw new Error(error.message || "Failed to verify Zendesk credentials");
      }

      console.log("Credentials verified, updating user metadata...");
      
      // If verification successful, update user metadata with all preferences
      const updateResponse = await updateUserMetadata({
        zendesk_domain: zendeskDomain,
        zendesk_email: zendeskEmail,
        zendesk_api_key: zendeskApiKey,
        zendesk_connected: true,
        zendesk_fetch_all_tickets: fetchAllTickets,
        zendesk_import_comments: importComments,
        zendesk_ticket_status: ticketStatus,
        zendesk_sync_interval: syncInterval,
        zendesk_last_connected: new Date().toISOString()
      });
      
      console.log("Metadata update response:", updateResponse);

      // Update local connection state immediately for better UX
      setIsZendeskConnected(true);
      
      // Then refresh the user data from the server
      console.log("Refreshing user data...");
      await refreshUser();
      
      console.log("Connection complete, success!");
      toast.success("Zendesk connected successfully!");
    } catch (error) {
      console.error("Error connecting Zendesk:", error);
      toast.error(error instanceof Error ? error.message : "Failed to connect Zendesk");
      
      // Reset connection state
      setIsZendeskConnected(false);
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
      
      // Force a short delay to ensure the UI updates before server processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear Zendesk related metadata - explicitly set all fields to empty
      console.log("Clearing Zendesk metadata...");
      const updateData = {
        zendesk_domain: "",
        zendesk_email: "",
        zendesk_api_key: "",
        zendesk_connected: false,
        zendesk_last_disconnected: new Date().toISOString()
      };
      
      const result = await updateUserMetadata(updateData);
      console.log("Metadata update result:", result);
      
      // Clear local state
      setZendeskDomain("");
      setZendeskEmail("");
      setZendeskApiKey("");
      
      // Force refresh user data from server
      console.log("Refreshing user data after disconnect...");
      await refreshUser();
      
      // Force a UI refresh
      window.dispatchEvent(new Event('zendesk:disconnected'));
      
      console.log("Zendesk disconnected successfully");
      toast.success("Zendesk disconnected successfully");
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
    <Card id="connections" className="relative scroll-mt-20">
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
            <div className="space-y-5">
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
              
              {/* Connection options */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-medium">Connection Options</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fetch-all-tickets" 
                    checked={fetchAllTickets}
                    onCheckedChange={(checked) => setFetchAllTickets(checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="fetch-all-tickets"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Fetch all tickets
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      When enabled, all tickets will be fetched regardless of status
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="import-comments" 
                    checked={importComments}
                    onCheckedChange={(checked) => setImportComments(checked === true)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="import-comments"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Import ticket comments
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Include comments when importing tickets
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ticket-status">Default Ticket Status</Label>
                  <Select 
                    value={ticketStatus} 
                    onValueChange={setTicketStatus}
                  >
                    <SelectTrigger id="ticket-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open Only</SelectItem>
                      <SelectItem value="pending">Pending Only</SelectItem>
                      <SelectItem value="solved">Solved Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Default status filter for ticket imports
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="sync-interval">Sync Interval</Label>
                  <Select 
                    value={syncInterval} 
                    onValueChange={setSyncInterval}
                  >
                    <SelectTrigger id="sync-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    How frequently tickets should be imported
                  </p>
                </div>
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