"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
}

interface ZendeskGroupsSelectorProps {
  onGroupsSelected: (groups: number[]) => void;
  selectedGroups: number[];
}

export function ZendeskGroupsSelector({ onGroupsSelected, selectedGroups }: ZendeskGroupsSelectorProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch Zendesk groups on component mount
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/zendesk-groups');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch Zendesk groups');
      }
      
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      console.error('Error fetching Zendesk groups:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Zendesk groups');
      toast.error('Failed to load Zendesk groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroupToggle = (groupId: number) => {
    const updatedGroups = selectedGroups.includes(groupId)
      ? selectedGroups.filter(id => id !== groupId)
      : [...selectedGroups, groupId];
    
    onGroupsSelected(updatedGroups);
  };

  const handleSelectAll = () => {
    onGroupsSelected(groups.map(group => group.id));
  };

  const handleClearAll = () => {
    onGroupsSelected([]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            Zendesk Groups
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>
          {selectedGroups.length === 0
            ? "All groups (unfiltered)"
            : `${selectedGroups.length} group${selectedGroups.length === 1 ? '' : 's'} selected`
          }
        </CardDescription>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-sm text-red-500 py-2">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchGroups}
                className="mt-2 w-full"
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-3">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleGroupToggle(group.id)}
                    />
                    <Label
                      htmlFor={`group-${group.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {group.name}
                    </Label>
                  </div>
                ))}
                {groups.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    No groups found
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchGroups}
                className="mt-3 w-full"
              >
                <RefreshCw className="mr-2 h-3 w-3" /> Refresh Groups
              </Button>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
} 