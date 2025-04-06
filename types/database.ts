export type Organization = {
  id: string
  created_at: string
  name: string
  slug: string
  owner_id: string
  zendesk_domain: string | null
  zendesk_api_token: string | null
  settings: {
    billing_email?: string
    subscription_tier?: 'free' | 'pro' | 'enterprise'
  }
}

export type Project = {
  id: string
  created_at: string
  name: string
  organization_id: string
  settings: {
    tracking_id?: string
    domains?: string[]
    privacy_settings?: {
      ip_anonymization: boolean
      cookie_lifetime: number
    }
  }
}

export type AnalyticsEvent = {
  id: string
  created_at: string
  project_id: string
  event_type: string
  event_name: string
  user_id?: string
  session_id: string
  properties: Record<string, any>
  page_url: string
  referrer?: string
  device_info: {
    browser: string
    os: string
    device_type: string
    screen_resolution?: string
  }
  geo_info?: {
    country?: string
    region?: string
    city?: string
  }
}

export type ZendeskTicket = {
  id: string
  created_at: string
  organization_id: string
  ticket_id: number
  subject: string
  description: string | null
  status: string
  priority: string | null
  assignee_id: number | null
  requester_id: number | null
  created_date: string
  updated_date: string
  solved_date: string | null
  first_response_time_minutes: number | null
  full_resolution_time_minutes: number | null
  tags: string[]
  custom_fields: Record<string, any>
  comments?: any[]
  group_id?: number | null
}

export type ZendeskAgent = {
  id: string
  created_at: string
  organization_id: string
  agent_id: number
  name: string
  email: string
  role: string
  active: boolean
}

export type TicketMetric = {
  id: string
  created_at: string
  organization_id: string
  ticket_id: string
  agent_id: string | null
  metric_type: string
  value: number
  measured_at: string
}

export type TeamMember = {
  id: string
  created_at: string
  organization_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  permissions: string[]
} 