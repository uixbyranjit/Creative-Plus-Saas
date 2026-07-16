import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getLeads } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LeadsClientPage from '@/components/leads/LeadsClientPage';

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const leads = await getLeads();

  return (
    <DashboardLayout>
      <LeadsClientPage initialLeads={leads} />
    </DashboardLayout>
  );
}
