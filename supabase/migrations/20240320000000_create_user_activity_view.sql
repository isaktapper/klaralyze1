-- Create a view that combines auth.users with profiles and organizations
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    au.id as user_id,
    au.email,
    au.created_at as signup_date,
    au.last_sign_in_at,
    p.full_name,
    p.job_title,
    o.name as organization_name,
    o.slug as organization_slug,
    o.company_size,
    o.monthly_tickets,
    o.primary_goal,
    o.source
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
LEFT JOIN public.organizations o ON au.id = o.owner_id
ORDER BY au.created_at DESC;

-- Create a function to get recent signups
CREATE OR REPLACE FUNCTION get_recent_signups(days_ago integer DEFAULT 7)
RETURNS TABLE (
    user_id uuid,
    email text,
    signup_date timestamptz,
    full_name text,
    organization_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        au.id,
        au.email,
        au.created_at,
        p.full_name,
        o.name
    FROM auth.users au
    LEFT JOIN public.profiles p ON au.id = p.id
    LEFT JOIN public.organizations o ON au.id = o.owner_id
    WHERE au.created_at >= NOW() - (days_ago || ' days')::interval
    ORDER BY au.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary()
RETURNS TABLE (
    total_users bigint,
    active_users bigint,
    new_users_today bigint,
    new_users_this_week bigint,
    avg_monthly_tickets numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT au.id) as total_users,
        COUNT(DISTINCT CASE WHEN au.last_sign_in_at >= NOW() - INTERVAL '30 days' THEN au.id END) as active_users,
        COUNT(DISTINCT CASE WHEN au.created_at >= NOW() - INTERVAL '1 day' THEN au.id END) as new_users_today,
        COUNT(DISTINCT CASE WHEN au.created_at >= NOW() - INTERVAL '7 days' THEN au.id END) as new_users_this_week,
        COALESCE(AVG(o.monthly_tickets), 0) as avg_monthly_tickets
    FROM auth.users au
    LEFT JOIN public.organizations o ON au.id = o.owner_id;
END;
$$ LANGUAGE plpgsql; 