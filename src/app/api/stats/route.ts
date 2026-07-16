import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/actions';

export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (e) {
    console.error("Stats API error:", e);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
