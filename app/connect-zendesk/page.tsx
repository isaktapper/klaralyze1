'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface StepProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({ currentStep, totalSteps }: StepProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <Progress value={(currentStep / totalSteps) * 100} />
      <p className="text-sm text-gray-500 mt-2">Step {currentStep} of {totalSteps}</p>
    </div>
  );
}

interface ZendeskGroup {
  id: number;
  name: string;
}

interface SelectedGroup extends ZendeskGroup {
  selected: boolean;
}

export default function ConnectZendeskPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showApiKeyHelp, setShowApiKeyHelp] = useState(false);
  const [formData, setFormData] = useState({
    subdomain: '',
    email: '',
    apiKey: ''
  });
  const [selectedData, setSelectedData] = useState({
    groups: [] as SelectedGroup[],
    channels: [] as string[],
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubdomainChange = (value: string) => {
    // Remove .zendesk.com if user types it
    const cleanValue = value.replace(/\.zendesk\.com$/, '');
    setFormData(prev => ({ ...prev, subdomain: cleanValue }));
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Clear any previous errors
      setError('');
      
      // Validate inputs
      if (!formData.subdomain || !formData.email || !formData.apiKey) {
        setError('Please fill in all fields');
        return;
      }

      // Validate and test credentials
      setIsLoading(true);
      try {
        console.log('Testing Zendesk connection...', {
          domain: `${formData.subdomain}.zendesk.com`,
          email: formData.email
        });

        const response = await fetch('/api/connect-zendesk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: `${formData.subdomain}.zendesk.com`,
            email: formData.email,
            apiKey: formData.apiKey,
          }),
        });

        const data = await response.json();
        console.log('Zendesk connection response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to connect to Zendesk');
        }

        // If successful, fetch groups and channels
        console.log('Fetching Zendesk groups...');
        const groupsResponse = await fetch(`https://${formData.subdomain}.zendesk.com/api/v2/groups.json`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + Buffer.from(`${formData.email}/token:${formData.apiKey}`).toString('base64'),
          },
        });

        if (!groupsResponse.ok) {
          throw new Error('Failed to fetch Zendesk groups');
        }

        const groupsData = await groupsResponse.json();
        console.log('Zendesk groups:', groupsData);

        setSelectedData(prev => ({
          ...prev,
          groups: groupsData.groups.map((group: ZendeskGroup) => ({
            id: group.id,
            name: group.name,
            selected: false
          }))
        }));

        // Move to next step
        setCurrentStep(2);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to connect to Zendesk');
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      // Validate that at least one group is selected
      if (!selectedData.groups.some(g => g.selected)) {
        setError('Please select at least one group to import');
        return;
      }

      // Save selected data and move to import process
      setIsLoading(true);
      try {
        // TODO: Add API endpoint to start the import process
        const response = await fetch('/api/start-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: `${formData.subdomain}.zendesk.com`,
            email: formData.email,
            apiKey: formData.apiKey,
            selectedGroups: selectedData.groups.filter(g => g.selected).map(g => g.id),
            startDate: selectedData.startDate,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to start import process');
        }

        setCurrentStep(3);
      } catch (error) {
        console.error('Error:', error);
        setError(error instanceof Error ? error.message : 'Failed to start import process');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Image
              src="/klaralyze_icon.svg"
              alt="Klaralyze"
              width={40}
              height={40}
            />
            <ArrowRight className="text-gray-400" />
            <Image
              src="/zendesk-logo.webp"
              alt="Zendesk"
              width={120}
              height={40}
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            Let's get your Zendesk account connected to Klaralyze
          </h1>
          <p className="text-gray-600 text-center mb-8">
            We'll guide you through the process step by step
          </p>

          <ProgressBar currentStep={currentStep} totalSteps={3} />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700 mb-1">
                  Zendesk Subdomain
                </label>
                <div className="flex items-center">
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className="flex-1"
                    placeholder="your-company"
                  />
                  <span className="ml-2 text-gray-500">.zendesk.com</span>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@your-company.com"
                />
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your API key"
                />
                <div className="mt-2">
                  <Collapsible open={showApiKeyHelp} onOpenChange={setShowApiKeyHelp}>
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                      {showApiKeyHelp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-4 w-4" />
                        How to get your API key
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 text-sm text-gray-600 space-y-2">
                      <p>To get your API key:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Log in to your Zendesk account</li>
                        <li>Go to Admin Center → Apps and Integrations → APIs</li>
                        <li>Click the "Add API token" button</li>
                        <li>Give your token a description (e.g., "Klaralyze Integration")</li>
                        <li>Copy the generated API token</li>
                      </ol>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Select what to import</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Groups
                    </label>
                    <div className="space-y-2">
                      {selectedData.groups.map((group) => (
                        <div key={group.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`group-${group.id}`}
                            checked={group.selected}
                            onChange={(e) => {
                              setSelectedData(prev => ({
                                ...prev,
                                groups: prev.groups.map(g =>
                                  g.id === group.id ? { ...g, selected: e.target.checked } : g
                                )
                              }));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`group-${group.id}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {group.name}
                          </label>
                        </div>
                      ))}
                      {selectedData.groups.length === 0 && (
                        <p className="text-sm text-gray-500">No groups found</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Channels
                    </label>
                    {/* Add channel selection UI here */}
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Import data from
                    </label>
                    <Input
                      id="startDate"
                      type="date"
                      value={selectedData.startDate}
                      onChange={(e) => setSelectedData(prev => ({ ...prev, startDate: e.target.value }))}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-sm text-gray-500 mt-1">Maximum 7 days back</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Importing your data...</h3>
              <p className="text-gray-600">This might take a few minutes</p>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-4">
            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Connecting...' : 'Next'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 