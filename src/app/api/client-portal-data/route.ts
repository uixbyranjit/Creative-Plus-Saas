import { NextResponse } from 'next/server';
import { getClients, getClientProfile } from '@/lib/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || '';

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const clients = await getClients();
    const matchedClient = clients.find((c: any) => c.email === email);

    if (!matchedClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const clientData = await getClientProfile(matchedClient.id);
    return NextResponse.json(clientData);
  } catch (e) {
    console.error("Client Portal Data API Error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
