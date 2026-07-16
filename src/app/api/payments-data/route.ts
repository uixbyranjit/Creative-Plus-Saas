import { NextResponse } from 'next/server';
import { getPayments, getSubscriptions } from '@/lib/actions';

export async function GET() {
  try {
    const [payments, subscriptions] = await Promise.all([
      getPayments(),
      getSubscriptions()
    ]);
    return NextResponse.json({ payments, subscriptions });
  } catch (e) {
    console.error("Payments data API error:", e);
    return NextResponse.json({ error: "Failed to load payments data" }, { status: 500 });
  }
}
