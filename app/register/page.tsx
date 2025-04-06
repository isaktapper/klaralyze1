"use client";

import { Logo } from '@/components/ui/Logo'
import { SignUpSteps } from '@/components/auth/signup-steps'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Logo size="large" className="mx-auto mb-8 white" />
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Get Started with Klaralyze
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of support teams who use Klaralyze to deliver exceptional customer service
          </p>
        </div>

        <SignUpSteps />
      </div>
    </div>
  )
} 