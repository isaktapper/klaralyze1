'use client'

import { AuthProvider } from '@/lib/auth'
import { Toaster } from 'react-hot-toast'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  )
} 