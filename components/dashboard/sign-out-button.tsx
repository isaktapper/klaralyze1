import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface SignOutButtonProps {
  isExpanded: boolean;
}

export function SignOutButton({ isExpanded }: SignOutButtonProps) {
  const { user, signOut } = useAuth();

  return (
    <div>
      <button
        onClick={signOut}
        className={cn(
          "flex h-12 items-center pl-2 text-sm font-medium transition-colors relative w-full rounded-lg",
          "text-white hover:bg-blue-700/50 hover:text-white"
        )}
      >
        <div className="w-8 flex items-center justify-center">
          <LogOut className="h-5 w-5 shrink-0" />
        </div>
        <span className={cn(
          "ml-4 transition-all duration-300",
          isExpanded ? "opacity-100" : "opacity-0"
        )}>
          Sign Out
        </span>
      </button>

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-center px-2">
          <div className="h-8 w-8 shrink-0 rounded-full bg-blue-700/50 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className={cn(
            "ml-4 min-w-0 transition-all duration-300",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-sm font-medium text-white truncate">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs text-blue-100 truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 