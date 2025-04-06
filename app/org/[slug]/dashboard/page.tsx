'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createBrowserClient } from '@supabase/ssr'
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow'

export default function DashboardPage({ params }: { params: { slug: string } }) {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showZendeskPrompt, setShowZendeskPrompt] = useState(false)
  const [hasZendeskConnection, setHasZendeskConnection] = useState(false)
  const { user } = useAuth()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return

      const { data: org, error } = await supabase
        .from('organizations')
        .select('settings, zendesk_domain, zendesk_api_token')
        .eq('slug', params.slug)
        .single()

      if (error) {
        console.error('Error fetching organization:', error)
        return
      }

      // Show onboarding only if settings don't exist or onboarding hasn't been completed
      const settings = org?.settings || {}
      if (!settings.onboarding_completed) {
        setShowOnboarding(true)
        // Update settings to mark onboarding as completed
        const { error: updateError } = await supabase
          .from('organizations')
          .update({
            settings: {
              ...settings,
              onboarding_completed: true
            }
          })
          .eq('slug', params.slug)

        if (updateError) {
          console.error('Error updating onboarding status:', updateError)
        }
      }

      // Check if Zendesk is connected - requires both domain and API token
      setHasZendeskConnection(!!(org?.zendesk_domain && org?.zendesk_api_token))
    }

    checkStatus()
  }, [user, params.slug])

  const handleConnectClick = () => {
    setShowZendeskPrompt(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navigation Bar - Fixed at the top */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              {!hasZendeskConnection && (
                <button
                  onClick={handleConnectClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Connect Zendesk
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {!hasZendeskConnection ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Zendesk Account</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              To start analyzing your support data, you need to connect your Zendesk account. This is required to import your tickets and provide insights.
            </p>
            <button
              onClick={() => window.location.href = `/org/${params.slug}/connect-zendesk`}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Connect Zendesk
            </button>
          </div>
        ) : (
          <>
            {/* Dashboard Overview Section */}
            <div className="dashboard-overview p-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              {/* Add your dashboard content here */}
            </div>

            {/* Metrics Section */}
            <div className="metrics-section p-6">
              <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
              {/* Add your metrics content here */}
            </div>

            {/* Trends Section */}
            <div className="trends-section p-6">
              <h2 className="text-xl font-semibold text-gray-900">Trends</h2>
              {/* Add your trends content here */}
            </div>

            {/* Team Performance Section */}
            <div className="team-performance p-6">
              <h2 className="text-xl font-semibold text-gray-900">Team Performance</h2>
              {/* Add your team performance content here */}
            </div>
          </>
        )}
      </div>

      {/* Onboarding Flow */}
      {showOnboarding && <OnboardingFlow orgSlug={params.slug} onClose={() => setShowOnboarding(false)} />}
      
      {/* Zendesk Connection Modal */}
      {showZendeskPrompt && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Connect Your Zendesk Account
            </h3>
            <p className="text-gray-600 mb-6">
              To start analyzing your support data, you need to connect your Zendesk account. This connection is required to import your tickets and provide insights.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => window.location.href = `/org/${params.slug}/connect-zendesk`}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Connect Zendesk
              </button>
              <button
                onClick={() => setShowZendeskPrompt(false)}
                className="w-full text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Look Around First
              </button>
              <p className="text-sm text-gray-500 text-center">
                Note: You'll need to connect Zendesk to see your data
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 