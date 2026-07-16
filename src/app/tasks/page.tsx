import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getTasks, getUsers, getPayments, getFollowUps, getOrders } from '@/lib/actions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TasksClientPage from '@/components/tasks/TasksClientPage';

export default async function TasksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [tasks, users, payments, followUps, orders] = await Promise.all([
    getTasks(),
    getUsers(),
    getPayments(),
    getFollowUps(),
    getOrders()
  ]);

  return (
    <DashboardLayout>
      <TasksClientPage 
        initialTasks={tasks} 
        users={users} 
        payments={payments}
        followUps={followUps}
        orders={orders}
      />
    </DashboardLayout>
  );
}
