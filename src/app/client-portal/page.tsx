import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getClients, getClientProfile } from '@/lib/actions';
import ClientPortalClientPage from '@/components/client-portal/ClientPortalClientPage';

export default async function ClientPortalPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  const role = (session.user as any).role;
  if (role !== 'CLIENT') {
    redirect('/dashboard');
  }

  // Look up client matching user email
  const email = (session.user as any).email || '';
  const clients = await getClients();
  const matchedClient = clients.find((c: any) => c.email === email);

  if (!matchedClient) {
    return (
      <div className="flex h-screen items-center justify-center p-6 text-center text-xs">
        <div>
          <h2 className="font-bold text-lg mb-2 text-red-500">Profile Not Wired</h2>
          <p className="text-zinc-500 max-w-sm">No Client CRM profile is connected to email: {session.user.email}. Please contact the agency admin.</p>
        </div>
      </div>
    );
  }

  // Load detailed profile details (orders, payments, files, timeline)
  const clientData = await getClientProfile(matchedClient.id);

  return (
    <ClientPortalClientPage client={clientData} user={session.user} />
  );
}
