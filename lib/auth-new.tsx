"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  isVerified: boolean;
  resetPassword: (email: string) => Promise<void>;
  updateUserMetadata: (metadata: Record<string, any>) => Promise<void>;
  refreshUser: () => Promise<void>;
  loading?: boolean; // For backward compatibility
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  isLoading: true,
  isVerified: false,
  resetPassword: async () => {},
  updateUserMetadata: async () => {},
  refreshUser: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    const initializeUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    initializeUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const isVerified = Boolean(user?.email_confirmed_at);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }
  };

  const updateUserMetadata = async (metadata: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error updating user metadata:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.refreshSession();
      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const value = {
    user,
    signIn,
    signOut,
    signUp,
    isLoading,
    isVerified,
    resetPassword,
    updateUserMetadata,
    refreshUser,
    loading: isLoading, // For backward compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
}; 