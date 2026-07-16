import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getOrders, getClients, getUsers } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import OrdersClientPage from '@/components/orders/OrdersClientPage';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [orders, clients, users] = await Promise.all([
    getOrders(),
    getClients(),
    getUsers()
  ]);

  return (
    <DashboardLayout>
      <OrdersClientPage 
        initialOrders={orders} 
        clients={clients} 
        users={users} 
      />
    </DashboardLayout>
  );
}
