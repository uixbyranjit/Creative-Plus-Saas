import { NextResponse } from 'next/server';
import { getClients } from '@/lib/actions';

export async function GET() {
  try {
    const clients = await getClients();
    return NextResponse.json(clients);
  } catch (e) {
    console.error("Clients data API error:", e);
    return NextResponse.json({ error: "Failed to load clients" }, { status: 500 });
  }
}
