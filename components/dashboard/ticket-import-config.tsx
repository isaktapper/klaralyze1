"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface TicketField {
  id: string;
  name: string;
  description?: string;
  mandatory?: boolean;
  group?: string;
}

interface TicketImportConfigProps {
  onConfigChange: (config: ImportConfig) => void;
  tickets: any[];
  onExport: (selectedFields: string[]) => void;
}

export interface ImportConfig {
  selectedFields: string[];
  includeComments: boolean;
  limitResults?: number;
}

export function TicketImportConfig({ onConfigChange, tickets, onExport }: TicketImportConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [includeComments, setIncludeComments] = useState(true);
  const [customFields, setCustomFields] = useState<TicketField[]>([]);
  
  // The mandatory fields that must be included in export
  const mandatoryFields: TicketField[] = [
    { id: "ticket_id", name: "Ticket ID", mandatory: true, group: "core" },
    { id: "group_id", name: "Group ID", mandatory: true, group: "core" },
    { id: "requester_id", name: "Requester ID", mandatory: true, group: "core" },
    { id: "assignee_id", name: "Assignee ID", mandatory: true, group: "core" },
  ];
  
  // Standard fields that are recommended but not mandatory
  const standardFields: TicketField[] = [
    { id: "subject", name: "Subject", group: "core" },
    { id: "description", name: "Description", group: "core" },
    { id: "status", name: "Status", group: "core" },
    { id: "priority", name: "Priority", group: "core" },
    { id: "type", name: "Type", group: "core" },
    { id: "tags", name: "Tags", group: "meta" },
    { id: "created_date", name: "Created Date", group: "dates" },
    { id: "updated_date", name: "Updated Date", group: "dates" },
    { id: "solved_date", name: "Solved Date", group: "dates" },
    { id: "organization_id", name: "Organization ID", group: "core" },
    { id: "satisfaction_rating", name: "Satisfaction Rating", group: "metrics" },
    { id: "first_response_time_minutes", name: "First Response Time", group: "metrics" },
    { id: "full_resolution_time_minutes", name: "Resolution Time", group: "metrics" },
  ];
  
  // Initialize with mandatory fields
  useEffect(() => {
    const mandatoryFieldIds = mandatoryFields.map(field => field.id);
    setSelectedFields([...mandatoryFieldIds, ...standardFields.map(field => field.id)]);
    
    // Detect custom fields from the first ticket
    if (tickets && tickets.length > 0 && tickets[0].custom_fields) {
      const customFieldsFromTicket = Object.keys(tickets[0].custom_fields || {}).map(key => ({
        id: `custom_fields.${key}`,
        name: key.replace(/_/g, ' '),
        group: 'custom',
      }));
      
      setCustomFields(customFieldsFromTicket);
    }
  }, [tickets]);
  
  const handleFieldToggle = (fieldId: string) => {
    // Check if it's a mandatory field
    if (mandatoryFields.some(field => field.id === fieldId)) {
      toast.error(`${fieldId} is a mandatory field and cannot be deselected`);
      return;
    }
    
    // Toggle the field's selection status
    if (selectedFields.includes(fieldId)) {
      setSelectedFields(selectedFields.filter(id => id !== fieldId));
    } else {
      setSelectedFields([...selectedFields, fieldId]);
    }
  };
  
  const handleCommentsToggle = (checked: boolean) => {
    setIncludeComments(checked);
  };
  
  const handleApply = () => {
    // Make sure all mandatory fields are included
    const mandatoryFieldIds = mandatoryFields.map(field => field.id);
    const allMandatoryIncluded = mandatoryFieldIds.every(id => selectedFields.includes(id));
    
    if (!allMandatoryIncluded) {
      toast.error("All mandatory fields must be included");
      const missingMandatoryFields = mandatoryFieldIds.filter(id => !selectedFields.includes(id));
      setSelectedFields([...selectedFields, ...missingMandatoryFields]);
      return;
    }
    
    // Update the parent component with the new configuration
    onConfigChange({
      selectedFields,
      includeComments,
    });
    
    setIsOpen(false);
    toast.success("Export configuration updated");
  };
  
  const handleExport = () => {
    onExport(selectedFields);
  };
  
  const allFields = [...mandatoryFields, ...standardFields, ...customFields];
  
  // Group fields by category
  const fieldsByGroup = allFields.reduce((groups, field) => {
    const group = field.group || 'other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(field);
    return groups;
  }, {} as Record<string, TicketField[]>);
  
  // Sort groups for display
  const groupOrder = ['core', 'metrics', 'dates', 'meta', 'custom', 'other'];
  const sortedGroups = Object.keys(fieldsByGroup).sort(
    (a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Settings className="mr-2 h-4 w-4" />
          Export Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ticket Export Configuration</DialogTitle>
          <DialogDescription>
            Select the fields you want to include in your export. 
            Mandatory fields cannot be deselected.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="fields">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fields">Select Fields</TabsTrigger>
            <TabsTrigger value="options">Export Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fields" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedGroups.map(group => (
                <div key={group} className="border rounded-md p-4">
                  <h3 className="font-medium mb-3 capitalize">{group} Fields</h3>
                  <div className="space-y-2">
                    {fieldsByGroup[group].map(field => (
                      <div key={field.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`field-${field.id}`}
                          checked={selectedFields.includes(field.id)}
                          onCheckedChange={() => handleFieldToggle(field.id)}
                          disabled={field.mandatory}
                        />
                        <div>
                          <Label
                            htmlFor={`field-${field.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {field.name}
                            {field.mandatory && (
                              <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1 py-0.5 rounded">
                                Required
                              </span>
                            )}
                          </Label>
                          {field.description && (
                            <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 border rounded-md p-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="comments"
                  checked={includeComments}
                  onCheckedChange={handleCommentsToggle}
                />
                <Label htmlFor="comments">Include full conversation history (comments)</Label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This may significantly increase the export file size for tickets with long conversations
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="options" className="mt-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Export Format</h3>
              <p className="text-sm text-gray-500">
                Currently, only CSV export is supported. More export formats will be added in the future.
              </p>
              
              <div className="mt-4 flex items-center space-x-2 p-2 bg-amber-50 border border-amber-200 rounded">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-amber-800">
                  Note: Long text fields like descriptions and comments may not display correctly in some CSV viewers. 
                  Consider importing the data into a database for complex analysis.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4 flex justify-between">
          <div className="text-sm text-gray-500">
            {selectedFields.length} fields selected
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply}>
              Apply Settings
            </Button>
            <Button onClick={handleExport} variant="default">
              <Download className="mr-2 h-4 w-4" />
              Export Now
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 