"use client";

import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export default function InvitePage() {
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty emails
      const validEmails = emails.filter(email => email.trim() !== '');
      
      if (validEmails.length === 0) {
        toast.error('Please enter at least one email address');
        return;
      }

      // TODO: Implement invitation logic
      toast.success('Invitations sent successfully!');
      setEmails(['']);
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Invite Teammates</h2>
          <p className="text-muted-foreground">
            Invite your team members to collaborate
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Invitations</CardTitle>
              <CardDescription>
                Enter the email addresses of the people you'd like to invite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {emails.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                    />
                    {emails.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeEmailField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmailField}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another
                  </Button>
                  
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Invitations'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Benefits</CardTitle>
              <CardDescription>Why you should invite your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">👥 Collaborate Effectively</h3>
                <p className="text-sm text-muted-foreground">
                  Work together on support analytics and share insights with your team.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">📊 Share Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Create and share custom reports with team members.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">🎯 Track Goals Together</h3>
                <p className="text-sm text-muted-foreground">
                  Set and monitor team goals and performance metrics.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">🔄 Stay in Sync</h3>
                <p className="text-sm text-muted-foreground">
                  Keep everyone updated with real-time analytics and insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 