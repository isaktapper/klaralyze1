'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckIcon, ChevronRightIcon, HelpCircleIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Group {
  id: number;
  name: string;
  description: string | null;
}

interface ZendeskData {
  subdomain: string;
  email: string;
  apiKey: string;
  groups: Group[];
}

export default function ConnectZendeskPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [progress, setProgress] = useState(33);
  
  const [selectedData, setSelectedData] = useState<ZendeskData>({
    subdomain: '',
    email: '',
    apiKey: '',
    groups: [],
  });
  
  const [availableGroups, setAvailableGroups] = useState<Group[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  useEffect(() => {
    // Set progress based on current step
    if (currentStep === 1) setProgress(33);
    if (currentStep === 2) setProgress(66);
    if (currentStep === 3) setProgress(100);
  }, [currentStep]);

  const handleNext = async () => {
    // Clear any previous errors
    setError('');
    
    if (currentStep === 1) {
      // Validate inputs
      if (!selectedData.subdomain || !selectedData.email || !selectedData.apiKey) {
        setError('Please fill in all fields');
        return;
      }
      
      setLoading(true);
      
      try {
        console.log('Testing Zendesk connection with:', {
          subdomain: selectedData.subdomain,
          email: selectedData.email
        });
        
        // Example API call to validate Zendesk credentials
        const response = await fetch('/api/connect-zendesk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subdomain: selectedData.subdomain,
            email: selectedData.email,
            apiKey: selectedData.apiKey,
          }),
        });
        
        const data = await response.json();
        console.log('API response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to Zendesk');
        }
        
        // Fetch groups from Zendesk
        const groupsResponse = await fetch(`/api/zendesk-groups?subdomain=${selectedData.subdomain}&email=${selectedData.email}&apiKey=${selectedData.apiKey}`);
        
        if (!groupsResponse.ok) {
          throw new Error('Failed to fetch Zendesk groups');
        }
        
        const groupsData = await groupsResponse.json();
        setAvailableGroups(groupsData.groups || []);
        
        // Move to step 2
        setCurrentStep(2);
      } catch (err) {
        console.error('Connection error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect to Zendesk');
      } finally {
        setLoading(false);
      }
    } else if (currentStep === 2) {
      // Validate that at least one group is selected
      if (selectedGroups.length === 0) {
        setError('Please select at least one group');
        return;
      }
      
      setLoading(true);
      
      try {
        // Start the import process
        const response = await fetch('/api/start-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subdomain: selectedData.subdomain,
            email: selectedData.email,
            apiKey: selectedData.apiKey,
            groups: availableGroups.filter(group => selectedGroups.includes(group.id)),
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to start import process');
        }
        
        // Move to step 3
        setCurrentStep(3);
        setImportSuccess(true);
      } catch (err) {
        console.error('Import error:', err);
        setError(err instanceof Error ? err.message : 'Failed to start import process');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGroupSelection = (groupId: number) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center border-b pb-6">
          <div className="mx-auto mb-4 relative w-40 h-16">
            <Image
              src="/zendesk-logo.webp"
              alt="Zendesk Logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <CardTitle className="text-2xl">Connect Your Zendesk Account</CardTitle>
          <CardDescription>
            Integrate your Zendesk account to analyze your support data
          </CardDescription>
        </CardHeader>
        
        <div className="px-6 py-4 border-b">
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-primary' : ''}`}>
              {currentStep > 1 ? (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-2">
                  <CheckIcon className="h-3 w-3" />
                </span>
              ) : (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-2">1</span>
              )}
              Connect
            </div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-primary' : ''}`}>
              {currentStep > 2 ? (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white mr-2">
                  <CheckIcon className="h-3 w-3" />
                </span>
              ) : (
                <span className={`flex items-center justify-center w-5 h-5 rounded-full ${currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200'} mr-2`}>2</span>
              )}
              Select Groups
            </div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-primary' : ''}`}>
              <span className={`flex items-center justify-center w-5 h-5 rounded-full ${currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-200'} mr-2`}>3</span>
              Import
            </div>
          </div>
        </div>
        
        {/* Display error message if any */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 border-b">
            <p>{error}</p>
          </div>
        )}
        
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  placeholder="your-company"
                  value={selectedData.subdomain}
                  onChange={(e) => setSelectedData({ ...selectedData, subdomain: e.target.value })}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: if your Zendesk URL is company.zendesk.com, enter "company"
                </p>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={selectedData.email}
                  onChange={(e) => setSelectedData({ ...selectedData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <HelpCircleIcon className="h-4 w-4 mr-1" />
                        <span>How to get your API key</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="bg-slate-50 p-4 rounded-md mt-2 text-sm">
                      <h4 className="font-semibold mb-2">How to generate a Zendesk API key:</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Log in to your Zendesk account</li>
                        <li>Click on the Admin icon (gear) in the sidebar</li>
                        <li>Under "Channels", select "API"</li>
                        <li>Click the "Add API token" button</li>
                        <li>Enter a description (e.g., "Klaralyze Integration")</li>
                        <li>Click "Create"</li>
                        <li>Copy the generated API token</li>
                      </ol>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={selectedData.apiKey}
                  onChange={(e) => setSelectedData({ ...selectedData, apiKey: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Select Groups to Import</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Choose the support groups whose data you want to analyze
                </p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                  {availableGroups.length === 0 ? (
                    <p className="text-gray-500 p-2">No groups found</p>
                  ) : (
                    availableGroups.map((group) => (
                      <div key={group.id} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded">
                        <Checkbox
                          id={`group-${group.id}`}
                          checked={selectedGroups.includes(group.id)}
                          onCheckedChange={() => handleGroupSelection(group.id)}
                        />
                        <div className="grid gap-1.5">
                          <Label
                            htmlFor={`group-${group.id}`}
                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {group.name}
                          </Label>
                          {group.description && (
                            <p className="text-sm text-gray-500 leading-snug">
                              {group.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4 text-center py-6">
              {importSuccess ? (
                <>
                  <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                    <CheckIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Success!</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Your Zendesk account has been connected and we've started importing your data.
                    This process may take a few minutes.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium">Processing</h3>
                  <p className="text-gray-500">
                    Starting import process, please wait...
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          {currentStep < 3 ? (
            <>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || loading}
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Processing...' : currentStep === 2 ? 'Start Import' : 'Next'}
                {!loading && currentStep < 3 && <ChevronRightIcon className="ml-2 h-4 w-4" />}
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
} 