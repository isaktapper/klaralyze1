'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface UserStats {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  avg_monthly_tickets: number;
}

interface RecentUser {
  email: string;
  signup_date: string;
  full_name: string;
  organization_name: string;
}

export function UserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch user activity summary
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_user_activity_summary');

        if (statsError) throw statsError;
        setStats(statsData[0]);

        // Fetch recent signups
        const { data: usersData, error: usersError } = await supabase
          .rpc('get_recent_signups', { days_ago: 7 });

        if (usersError) throw usersError;
        setRecentUsers(usersData);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading user statistics...</div>;
  }

  if (!stats) {
    return <div>Error loading user statistics</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.new_users_today}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Monthly Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avg_monthly_tickets)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.full_name || user.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.organization_name}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.signup_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 