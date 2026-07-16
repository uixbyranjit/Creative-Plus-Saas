import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardStats, getUsers, getClients, getOrders } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardClientPage from '@/components/dashboard/DashboardClientPage';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/login');
  }

  // Redirect client roles to client portal dashboard
  const role = (session.user as any).role;
  if (role === 'CLIENT') {
    redirect('/client-portal');
  }

  // Fetch all stats and dropdown list choices in parallel
  const [stats, users, clients, orders] = await Promise.all([
    getDashboardStats(),
    getUsers(),
    getClients(),
    getOrders()
  ]);

  return (
    <DashboardLayout>
      <DashboardClientPage 
        initialStats={stats} 
        users={users} 
        clients={clients} 
        orders={orders} 
      />
    </DashboardLayout>
  );
}
