import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ZendeskConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZendeskConnectModal({ isOpen, onClose }: ZendeskConnectModalProps) {
  const router = useRouter();
  const [zendeskForm, setZendeskForm] = useState({
    domain: '',
    email: '',
    apiKey: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleZendeskConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsConnecting(true);

    try {
      const response = await fetch('/api/connect-zendesk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zendeskForm),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect to Zendesk');
      }

      onClose();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Zendesk. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connect Zendesk</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleZendeskConnect} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
              Zendesk Domain
            </label>
            <Input
              id="domain"
              type="text"
              placeholder="your-domain.zendesk.com"
              value={zendeskForm.domain}
              onChange={(e) => setZendeskForm(prev => ({ ...prev, domain: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={zendeskForm.email}
              onChange={(e) => setZendeskForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Zendesk API key"
              value={zendeskForm.apiKey}
              onChange={(e) => setZendeskForm(prev => ({ ...prev, apiKey: e.target.value }))}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
          <div className="space-y-4 pt-4">
            <Button 
              type="submit"
              className="w-full"
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect with Zendesk'}
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              onClick={onClose}
              disabled={isConnecting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 