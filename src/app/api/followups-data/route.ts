import { NextResponse } from 'next/server';
import { getFollowUps } from '@/lib/actions';

export async function GET() {
  try {
    const followUps = await getFollowUps();
    return NextResponse.json(followUps);
  } catch (e) {
    console.error("Follow-ups data API error:", e);
    return NextResponse.json({ error: "Failed to load follow-ups" }, { status: 500 });
  }
}
