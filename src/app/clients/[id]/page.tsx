import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getClientProfile } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientProfileClientPage from '@/components/clients/ClientProfileClientPage';

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const clientData = await getClientProfile(id);

  if (!clientData) {
    redirect('/clients');
  }

  return (
    <DashboardLayout>
      <ClientProfileClientPage client={clientData} />
    </DashboardLayout>
  );
}
