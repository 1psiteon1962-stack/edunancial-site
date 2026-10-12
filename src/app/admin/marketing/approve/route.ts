import { NextResponse } from 'next/server';
import { requireAdminApiSession } from '@/lib/admin-content/auth';
import { getNeonSql } from '@/lib/db/neon';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  // Verify the signed admin session and CSRF token here; never rely on middleware alone.
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const sql = getNeonSql();
  if (!sql) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  const body = await request.json() as { publicationIds?: string[] };
  const ids = Array.isArray(body.publicationIds) ? body.publicationIds.filter(Boolean) : [];
  // The approver is the authenticated admin, not a client-supplied value.
  const approvedBy = auth.session.email;
  if (!ids.length) {
    return NextResponse.json({ error: 'publicationIds are required' }, { status: 400 });
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
