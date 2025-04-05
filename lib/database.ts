import { supabase } from './supabase'
import type { Organization, Project, TeamMember, AnalyticsEvent } from '@/types/database'

export async function createOrganization(name: string, ownerId: string): Promise<Organization | null> {
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  
  const { data, error } = await supabase
    .from('organizations')
    .insert([
      {
        name,
        slug,
        owner_id: ownerId,
        settings: {
          subscription_tier: 'free'
        }
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating organization:', error)
    return null
  }

  return data
}

export async function createProject(name: string, organizationId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        name,
        organization_id: organizationId,
        settings: {
          privacy_settings: {
            ip_anonymization: true,
            cookie_lifetime: 30
          }
        }
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return data
}

export async function addTeamMember(
  organizationId: string,
  userId: string,
  role: TeamMember['role'] = 'member'
): Promise<TeamMember | null> {
  const { data, error } = await supabase
    .from('team_members')
    .insert([
      {
        organization_id: organizationId,
        user_id: userId,
        role,
        permissions: getDefaultPermissionsForRole(role)
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error adding team member:', error)
    return null
  }

  return data
}

export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('analytics_events')
    .insert([event])

  if (error) {
    console.error('Error tracking event:', error)
    return false
  }

  return true
}

function getDefaultPermissionsForRole(role: TeamMember['role']): string[] {
  switch (role) {
    case 'owner':
      return ['admin', 'write', 'read']
    case 'admin':
      return ['write', 'read']
    case 'member':
      return ['write', 'read']
    case 'viewer':
      return ['read']
    default:
      return ['read']
  }
} 