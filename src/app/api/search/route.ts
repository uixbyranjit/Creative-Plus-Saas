import { NextResponse } from 'next/server';
import { getClients, getOrders, getTasks, getPayments } from '@/lib/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.toLowerCase() || '';

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const clients = await getClients();
    const orders = await getOrders();
    const tasks = await getTasks();
    const payments = await getPayments();

    const results: any[] = [];

    // Search Clients
    clients.forEach((c: any) => {
      if (
        c.name.toLowerCase().includes(q) || 
        c.companyName?.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'client',
          id: c.id,
          title: c.name,
          subtitle: `Client • ${c.companyName || 'No Company'}`,
          link: '/clients'
        });
      }
    });

    // Search Orders
    orders.forEach((o: any) => {
      if (
        o.serviceName.toLowerCase().includes(q) || 
        o.orderId.toLowerCase().includes(q) || 
        o.workType.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'order',
          id: o.id,
          title: o.serviceName,
          subtitle: `Order • ${o.orderId} (${o.status})`,
          link: '/orders'
        });
      }
    });

    // Search Tasks
    tasks.forEach((t: any) => {
      if (
        t.name.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'task',
          id: t.id,
          title: t.name,
          subtitle: `Task • Assigned to ${t.assignedTo?.name || 'Unassigned'}`,
          link: '/tasks'
        });
      }
    });

    // Search Payments
    payments.forEach((p: any) => {
      if (
        p.invoiceNumber.toLowerCase().includes(q) || 
        p.client?.name.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'payment',
          id: p.id,
          title: `Invoice ${p.invoiceNumber}`,
          subtitle: `Payment • $${p.totalAmount} (${p.status})`,
          link: '/payments'
        });
      }
    });

    return NextResponse.json(results.slice(0, 10));
  } catch (err) {
    console.error("Search API Error:", err);
    return NextResponse.json([]);
  }
}
