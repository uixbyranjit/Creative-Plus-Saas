import { NextResponse } from 'next/server';
import { getTasks } from '@/lib/actions';

export async function GET() {
  try {
    const tasks = await getTasks();
    return NextResponse.json(tasks);
  } catch (e) {
    console.error("Tasks data API error:", e);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}
