import { NextResponse } from 'next/server';
import { getNeonSql } from '@/lib/db/neon';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const sql = getNeonSql();
  if (!sql) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const body = await request.json() as { publicationIds?: string[]; approvedBy?: string };
  const ids = Array.isArray(body.publicationIds) ? body.publicationIds.filter(Boolean) : [];
  const approvedBy = body.approvedBy?.trim();
  if (!ids.length || !approvedBy) {
    return NextResponse.json({ error: 'publicationIds and approvedBy are required' }, { status: 400 });
  }

  const updated = await sql`
    update marketing_publications
    set status='approved', updated_at=now()
    where id = any(${ids}::uuid[]) and status='review'
    returning id
  `;

  await sql`
    update marketing_approval_batches b
    set status='approved', approved_at=now(), approved_by=${approvedBy}
    where b.status='open'
      and not exists (
        select 1 from marketing_approval_batch_items bi
        join marketing_publications p on p.id=bi.publication_id
        where bi.batch_id=b.id and p.status <> 'approved'
      )
  `;

  return NextResponse.json({ approved: updated.length });
}
