import { NextResponse } from 'next/server';
import { getLeads } from '@/lib/actions';

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (e) {
    console.error("Leads data API error:", e);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
