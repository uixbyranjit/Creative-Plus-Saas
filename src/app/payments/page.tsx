import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getPayments, getClients, getOrders, getSubscriptions } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PaymentsClientPage from '@/components/payments/PaymentsClientPage';

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Authorize: Admin or Manager only
  const role = (session.user as any).role;
  if (role !== 'ADMIN' && role !== 'MANAGER') {
    redirect('/dashboard');
  }

  const [payments, clients, orders, subscriptions] = await Promise.all([
    getPayments(),
    getClients(),
    getOrders(),
    getSubscriptions()
  ]);

  return (
    <DashboardLayout>
      <PaymentsClientPage 
        initialPayments={payments} 
        clients={clients} 
        orders={orders}
        initialSubscriptions={subscriptions}
      />
    </DashboardLayout>
  );
}
