import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getClients } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ClientsClientPage from '@/components/clients/ClientsClientPage';

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const clients = await getClients();

  return (
    <DashboardLayout>
      <ClientsClientPage initialClients={clients} />
    </DashboardLayout>
  );
}
