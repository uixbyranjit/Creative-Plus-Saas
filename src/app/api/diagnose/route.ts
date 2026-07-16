import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  
  let host = 'Not Set';
  let isLocal = false;
  
  if (dbUrl) {
    try {
      // Basic parse of host from postgresql://user:pass@host:port/db
      const match = dbUrl.match(/@([^/:]+)/);
      if (match && match[1]) {
        host = match[1];
        if (host === 'localhost' || host === '127.0.0.1') {
          isLocal = true;
        }
      }
    } catch (e) {
      host = 'Failed to parse';
    }
  }

  return NextResponse.json({
    databaseUrlConfigured: !!dbUrl,
    databaseHost: host,
    isConnectingToLocalhost: isLocal,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL || 'not-vercel'
  });
}
