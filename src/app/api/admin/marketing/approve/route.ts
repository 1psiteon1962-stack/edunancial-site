import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/db/neon';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const sql = getNeonSql();
  if (!sql) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const body = await request.json() as { publicationIds?: string[]; approvedBy?: string };
  const ids = Array.isArray(body.publicationIds) ? body.publicationIds.filter(Boolean) : [];
  if (!ids.length || !body.approvedBy?.trim()) {
    return NextResponse.json({ error: 'publicationIds and approvedBy are required' }, { status: 400 });
  }

  const updated = await sql`
    update marketing_publications
    set status='approved', updated_at=now()
    where id = any(${ids}::uuid[]) and status='review'
    returning id
  `;
  return NextResponse.json({ approved: updated.length });
}
