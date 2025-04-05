import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Joyride, { Step, STATUS } from 'react-joyride'
import { supabase } from '@/lib/supabase'

interface OnboardingFlowProps {
  orgSlug: string
  onClose: () => void
}

export function OnboardingFlow({ orgSlug, onClose }: OnboardingFlowProps) {
  const [showTour, setShowTour] = useState(true)
  const [showZendeskPrompt, setShowZendeskPrompt] = useState(false)
  const router = useRouter()

  // Define the tour steps
  const steps: Step[] = [
    {
      target: '.dashboard-overview',
      content: 'Welcome to your analytics dashboard! To get started, you\'ll need to connect your Zendesk account.',
      disableBeacon: true,
    },
    {
      target: '.metrics-section',
      content: 'Once connected, you\'ll see key metrics like response time, resolution rate, and customer satisfaction.',
    },
    {
      target: '.trends-section',
      content: 'Analyze trends and patterns in your support data over time.',
    },
    {
      target: '.team-performance',
      content: 'Monitor your team\'s performance and workload distribution.',
    },
    {
      target: 'body',
      placement: 'center',
      content: 'To start seeing your data, you\'ll need to connect your Zendesk account. Ready to connect?',
    }
  ]

  const handleJoyrideCallback = (data: any) => {
    const { status, index } = data
    
    // If user reaches the last step or finishes/skips the tour
    if (index === steps.length - 1 || [STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setShowTour(false)
      setShowZendeskPrompt(true)
      // Mark the tour as completed
      updateUserOnboardingStatus()
    }
  }

  const updateUserOnboardingStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // First get current settings
      const { data: org } = await supabase
        .from('organizations')
        .select('settings')
        .eq('slug', orgSlug)
        .single()

      const currentSettings = org?.settings || {}
      
      // Update settings while preserving other fields
      const { error } = await supabase
        .from('organizations')
        .update({
          settings: {
            ...currentSettings,
            onboarding_completed: true
          }
        })
        .eq('slug', orgSlug)

      if (error) {
        console.error('Error updating onboarding status:', error)
      }
    }
  }

  const handleConnectZendesk = () => {
    router.push(`/org/${orgSlug}/connect-zendesk`)
  }

  const handleSkipConnection = async () => {
    setShowZendeskPrompt(false)
    onClose()
    // Note: We're not marking it as skipped anymore since it's required
    router.refresh() // Refresh the page to show the Zendesk connection required state
  }

  return (
    <>
      {showTour && (
        <Joyride
          steps={steps}
          continuous
          showProgress
          showSkipButton
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: '#2563eb',
              zIndex: 1000,
            },
          }}
        />
      )}

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
                onClick={handleConnectZendesk}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Connect Zendesk
              </button>
              <button
                onClick={handleSkipConnection}
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
    </>
  )
} 