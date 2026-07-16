import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/actions';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (e) {
    console.error("Orders data API error:", e);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
