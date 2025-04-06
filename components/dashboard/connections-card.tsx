"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Link, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ConnectionsCardProps {
  connections: {
    id: string;
    name: string;
    status: "connected" | "disconnected" | "error";
    lastUpdated?: Date;
    details?: string;
  }[];
}

export function ConnectionsCard({ connections }: ConnectionsCardProps) {
  const router = useRouter();
  const [reconnecting, setReconnecting] = useState<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, "connected" | "disconnected" | "error">>({});

  const handleReconnect = (id: string) => {
    setReconnecting(id);
    
    if (id === "zendesk") {
      router.push("/connect-zendesk");
    }
  };

  const checkConnectionStatus = async (id: string) => {
    setChecking(id);
    
    try {
      const response = await fetch('/api/connections/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionType: id }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.status === 'connected') {
          setConnectionStatus(prev => ({ ...prev, [id]: 'connected' }));
          toast.success(`${id} connection checked successfully`);
        } else if (data.status === 'error') {
          setConnectionStatus(prev => ({ ...prev, [id]: 'error' }));
          toast.error(`Connection error: ${data.message}`);
        } else {
          setConnectionStatus(prev => ({ ...prev, [id]: 'disconnected' }));
          toast.error(`${id} is disconnected: ${data.message}`);
        }
      } else {
        setConnectionStatus(prev => ({ ...prev, [id]: 'error' }));
        toast.error(`Failed to check ${id} connection: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`Error checking ${id} connection:`, error);
      setConnectionStatus(prev => ({ ...prev, [id]: 'error' }));
      toast.error(`Failed to check ${id} connection`);
    } finally {
      setChecking(null);
      // Force refresh to get updated user metadata
      router.refresh();
    }
  };

  const getStatusBadge = (id: string, status: string) => {
    // If we have a checked status, use that instead
    const actualStatus = connectionStatus[id] || status;
    
    switch (actualStatus) {
      case "connected":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <X className="w-3 h-3 mr-1" />
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="w-4 h-4 mr-2" />
          Connections
        </CardTitle>
        <CardDescription>
          Manage your external service connections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {connections.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No connections configured
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection) => (
                <div 
                  key={connection.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{connection.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {connection.details || 
                        (connection.status === "connected" 
                          ? "Connection active and working properly" 
                          : "Connection not established")}
                    </div>
                    {connection.lastUpdated && (
                      <div className="text-xs text-muted-foreground">
                        Last updated: {connection.lastUpdated.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(connection.id, connection.status)}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => checkConnectionStatus(connection.id)}
                        disabled={checking === connection.id}
                      >
                        {checking === connection.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check Status"
                        )}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant={connectionStatus[connection.id] === "connected" || connection.status === "connected" ? "outline" : "default"}
                        onClick={() => handleReconnect(connection.id)}
                        disabled={reconnecting === connection.id}
                      >
                        {reconnecting === connection.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                            Reconnecting...
                          </>
                        ) : (
                          connectionStatus[connection.id] === "connected" || connection.status === "connected" ? "Reconnect" : "Connect"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => router.push("/connect-zendesk")}
          >
            Add New Connection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 