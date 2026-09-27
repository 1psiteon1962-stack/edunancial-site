import { NextResponse } from 'next/server';
import { publishDueMarketing } from '@/lib/marketing/scheduler';

export const runtime = 'nodejs';

function authorized(request: Request) {
  const expected = process.env.EDUNANCIAL_MARKETING_CRON_SECRET?.trim();
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  return Boolean(expected && supplied && expected === supplied);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const results = await publishDueMarketing();
    return NextResponse.json({ processed: results.length, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Marketing scheduler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
