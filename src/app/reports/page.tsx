import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardStats, getTeamStats } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ReportsClientPage from '@/components/reports/ReportsClientPage';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Authorize: Admin or Manager only
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    redirect('/dashboard');
  }

  const [stats, teamStats] = await Promise.all([
    getDashboardStats(),
    getTeamStats()
  ]);

  return (
    <DashboardLayout>
      <ReportsClientPage 
        stats={stats} 
        teamStats={teamStats} 
      />
    </DashboardLayout>
  );
}
