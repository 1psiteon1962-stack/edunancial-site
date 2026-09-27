import { NextResponse } from 'next/server';

// Approval mutations live under /admin so admin-session middleware protects them.
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
