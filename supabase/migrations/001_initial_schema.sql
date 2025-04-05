-- Create organizations table
CREATE TABLE organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  zendesk_domain TEXT,
  zendesk_api_token TEXT,
  settings JSONB DEFAULT '{}'::JSONB,
  UNIQUE (owner_id, slug)
);

-- Create zendesk_tickets table
CREATE TABLE zendesk_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ticket_id BIGINT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT,
  assignee_id BIGINT,
  requester_id BIGINT,
  created_date TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_date TIMESTAMP WITH TIME ZONE NOT NULL,
  solved_date TIMESTAMP WITH TIME ZONE,
  first_response_time_minutes INTEGER,
  full_resolution_time_minutes INTEGER,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}'::JSONB,
  UNIQUE (organization_id, ticket_id)
);

-- Create zendesk_agents table
CREATE TABLE zendesk_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id BIGINT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  UNIQUE (organization_id, agent_id)
);

-- Create ticket_metrics table
CREATE TABLE ticket_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  ticket_id UUID NOT NULL REFERENCES zendesk_tickets(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES zendesk_agents(id),
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create team_members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions TEXT[] DEFAULT ARRAY['read'],
  UNIQUE (organization_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_tickets_organization_id ON zendesk_tickets(organization_id);
CREATE INDEX idx_tickets_created_date ON zendesk_tickets(created_date);
CREATE INDEX idx_tickets_status ON zendesk_tickets(status);
CREATE INDEX idx_tickets_assignee ON zendesk_tickets(assignee_id);
CREATE INDEX idx_metrics_organization_id ON ticket_metrics(organization_id);
CREATE INDEX idx_metrics_ticket_id ON ticket_metrics(ticket_id);
CREATE INDEX idx_metrics_type ON ticket_metrics(metric_type);

-- Set up Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zendesk_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE zendesk_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM team_members WHERE organization_id = organizations.id
    )
  );

CREATE POLICY "Organization owners can update their organizations"
  ON organizations FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can view tickets in their organizations"
  ON zendesk_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE organization_id = zendesk_tickets.organization_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view agents in their organizations"
  ON zendesk_agents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE organization_id = zendesk_agents.organization_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view metrics in their organizations"
  ON ticket_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE organization_id = ticket_metrics.organization_id
      AND user_id = auth.uid()
    )
  ); 