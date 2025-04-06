"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
  description?: string;
}

interface ZendeskGroupsSelectorProps {
  selectedGroups: number[];
  onGroupsSelected: (groupIds: number[]) => void;
}

export function ZendeskGroupsSelector({
  selectedGroups,
  onGroupsSelected,
}: ZendeskGroupsSelectorProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching Zendesk groups from API');
      const response = await fetch("/api/zendesk-groups");
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching groups:', errorData);
        throw new Error(errorData.error || 'Failed to fetch Zendesk groups');
      }
      
      const data = await response.json();
      console.log('Groups data received:', data);
      
      if (!data.groups || !Array.isArray(data.groups)) {
        throw new Error('Invalid group data format received');
      }
      
      setGroups(data.groups);
    } catch (err) {
      console.error('Error in fetchGroups:', err);
      setError(err instanceof Error ? err.message : 'Failed to load groups');
      toast.error('Failed to load Zendesk groups');
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: number) => {
    if (selectedGroups.includes(groupId)) {
      onGroupsSelected(selectedGroups.filter((id) => id !== groupId));
    } else {
      onGroupsSelected([...selectedGroups, groupId]);
    }
  };

  const selectAll = () => {
    onGroupsSelected(groups.map((group) => group.id));
  };

  const clearAll = () => {
    onGroupsSelected([]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Zendesk Groups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-3">
          <Button variant="ghost" size="sm" onClick={selectAll} disabled={loading || groups.length === 0}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll} disabled={loading || selectedGroups.length === 0}>
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={fetchGroups} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        
        {error && (
          <div className="text-sm text-red-500 mb-2 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {/* Selection status */}
        <div className="text-sm mb-3 text-gray-500">
          {selectedGroups.length === 0 
            ? "All groups (unfiltered)" 
            : `${selectedGroups.length} group${selectedGroups.length === 1 ? '' : 's'} selected`
          }
        </div>
        
        {loading ? (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            {error ? 'Unable to load groups' : 'No groups available'}
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {groups.map((group) => (
              <div key={group.id} className="flex items-center space-x-2 border-b pb-2">
                <Checkbox
                  id={`group-${group.id}`}
                  checked={selectedGroups.includes(group.id)}
                  onCheckedChange={() => toggleGroup(group.id)}
                />
                <div className="flex flex-col">
                  <label
                    htmlFor={`group-${group.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {group.name} <span className="text-xs text-gray-500">(ID: {group.id})</span>
                  </label>
                  {group.description && (
                    <span className="text-xs text-gray-500">{group.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedGroups.length > 0 && (
          <div className="mt-3 text-xs text-gray-500">
            Selected group IDs: {selectedGroups.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 