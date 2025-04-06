'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import React from 'react'
import { User, AuthResponse, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type AuthContextType = {
  user: User | null
  loading: boolean
  isVerified: boolean
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  updateUserMetadata: (metadata: Record<string, any>) => Promise<void>
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session:', session);
      setUser(session?.user ?? null)
      setIsVerified(session?.user?.email_confirmed_at !== null)
      setLoading(false)
    })

    // Listen for changes on auth state (signed in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setUser(session?.user ?? null)
      setIsVerified(session?.user?.email_confirmed_at !== null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      console.log('Signing up user:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email_confirmed: false
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user data returned');
        throw new Error('No user data returned');
      }

      console.log('Signup successful:', data);
      toast.success('Account created! Please check your email to verify your account.');
      router.push('/dashboard');
      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in user:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        throw error;
      }

      console.log('Signin successful:', data);
      setIsVerified(data.user?.email_confirmed_at !== null);
      router.push('/dashboard');
      return { data, error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const updateUserMetadata = async (metadata: Record<string, any>) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) {
        console.error('Error updating user metadata:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }
  }

  const refreshUser = async () => {
    try {
      const { data } = await supabase.auth.refreshSession();
      if (data.user) {
        setUser(data.user);
        setIsVerified(data.user.email_confirmed_at !== null);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  }

  const value = {
    user,
    loading,
    isVerified,
    signUp,
    signIn,
    signOut,
    updateUserMetadata,
    refreshUser,
    isLoading: loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 