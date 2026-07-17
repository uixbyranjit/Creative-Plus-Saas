import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getDashboardStats, getUsers, getClients, getOrders } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardClientPage from '@/components/dashboard/DashboardClientPage';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Read cookies manually from headers for diagnostics
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  const cookieNames = cookieHeader.split(';').map(c => c.split('=')[0].trim()).filter(Boolean);

  console.warn("DASHBOARD PAGE SERVER COMPONENT AUDIT:", {
    file: "src/app/dashboard/page.tsx",
    function: "DashboardPage",
    pathname: "/dashboard",
    sessionPresent: !!session,
    sessionUser: session ? { name: session.user?.name, email: session.user?.email, role: (session.user as any)?.role } : null,
    cookieNames,
    hasSecretEnv: !!process.env.NEXTAUTH_SECRET
  });

  if (!session || !session.user) {
    console.error("DASHBOARD PAGE REDIRECT TRIGGERED: Redirecting unauthenticated user to /login from line 30");
    redirect('/login');
  }

  // Redirect client roles to client portal dashboard
  const role = (session.user as any).role;
  if (role === 'CLIENT') {
    console.warn("DASHBOARD PAGE REDIRECT TRIGGERED: Redirecting CLIENT role to /client-portal from line 36");
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
