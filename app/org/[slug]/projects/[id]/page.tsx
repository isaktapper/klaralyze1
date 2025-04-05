'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/auth/protected-route'
import { AnalyticsEvent, Project } from '@/types/database'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProjectDashboard({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [pageViews, setPageViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProject() {
      const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single()

      setProject(project)
    }

    async function loadPageViews() {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: events } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('project_id', params.id)
        .eq('event_type', 'pageview')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      // Group by day
      const dailyPageViews = events?.reduce((acc: any, event: AnalyticsEvent) => {
        const date = new Date(event.created_at).toLocaleDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      // Convert to array format for chart
      const data = Object.entries(dailyPageViews || {}).map(([date, count]) => ({
        date,
        views: count
      }))

      setPageViews(data)
      setLoading(false)
    }

    loadProject()
    loadPageViews()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold text-gray-900">{project?.name}</h1>
              <p className="mt-2 text-sm text-gray-700">
                Analytics dashboard for your project
              </p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-medium text-gray-900">Page Views (Last 30 Days)</h2>
            <div className="mt-4 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-medium text-gray-900">Tracking Code</h2>
              <p className="mt-2 text-sm text-gray-600">
                Add this code to your website to start tracking analytics
              </p>
              <pre className="mt-4 bg-gray-50 p-4 rounded text-sm overflow-auto">
                {`<script src="https://api.klaralyze.com/analytics.js"></script>
<script>
  window.klaralyzeInit("${project?.id}");
</script>`}
              </pre>
            </div>

            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-medium text-gray-900">Settings</h2>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Privacy Settings</h3>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={project?.settings?.privacy_settings?.ip_anonymization}
                      readOnly
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label className="ml-2 text-sm text-gray-600">
                      IP Anonymization
                    </label>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">
                      Cookie Lifetime: {project?.settings?.privacy_settings?.cookie_lifetime} days
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 