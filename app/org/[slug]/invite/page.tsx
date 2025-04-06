'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';

export default function InvitePage() {
  const { slug } = useParams();
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Implement invite logic
      toast.success('Invitations sent successfully');
      setEmails(['']);
    } catch (error) {
      toast.error('Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Invite Coworkers</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Send Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-1">
                  <Label htmlFor={`email-${index}`} className="sr-only">
                    Email {index + 1}
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="coworker@company.com"
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleRemoveEmail(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEmail}
              >
                Add Another
              </Button>
              
              <Button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Invitations'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 