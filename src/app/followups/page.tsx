import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getFollowUps, getClients } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import FollowupsClientPage from '@/components/followups/FollowupsClientPage';

export default async function FollowUpsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [followUps, clients] = await Promise.all([
    getFollowUps(),
    getClients()
  ]);

  return (
    <DashboardLayout>
      <FollowupsClientPage 
        initialFollowUps={followUps} 
        clients={clients} 
      />
    </DashboardLayout>
  );
}
