import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SettingsClientPage from '@/components/settings/SettingsClientPage';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <SettingsClientPage user={session.user} />
    </DashboardLayout>
  );
}
