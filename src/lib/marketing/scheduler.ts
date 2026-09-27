import { getNeonSql } from '@/lib/db/neon';
import { publisherFor } from './publishers';
import type { MarketingPlatform, PublishRequest } from './types';

type DuePublication = {
  id: string;
  platform: MarketingPlatform;
  platform_copy: string;
  media_refs: unknown;
  scheduled_for: string;
  attempt_count: number;
};

function mediaRefs(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

export async function publishDueMarketing(now = new Date()) {
  const sql = getNeonSql();
  if (!sql) throw new Error('Marketing scheduler requires DATABASE_URL or NETLIFY_DATABASE_URL.');

  const due = await sql`
    select id, platform, platform_copy, media_refs, scheduled_for, attempt_count
    from marketing_publications
    where status = 'scheduled' and scheduled_for <= ${now.toISOString()}
    order by scheduled_for asc
    limit 25
  ` as DuePublication[];

  const results: Array<{ id: string; status: 'published' | 'failed'; error?: string }> = [];

  for (const row of due) {
    const claimed = await sql`
      update marketing_publications
      set status = 'publishing', attempt_count = attempt_count + 1, updated_at = now()
      where id = ${row.id} and status = 'scheduled'
      returning id
    `;
    if (claimed.length === 0) continue;

    const request: PublishRequest = {
      publicationId: row.id,
      platform: row.platform,
      copy: row.platform_copy,
      mediaRefs: mediaRefs(row.media_refs),
      scheduledFor: row.scheduled_for,
    };

    try {
      const result = await publisherFor(row.platform).publish(request);
      await sql`
        update marketing_publications
        set status='published', provider_publication_id=${result.providerPublicationId},
            published_at=${result.publishedAt}, last_error=null, updated_at=now()
        where id=${row.id}
      `;
      await sql`insert into marketing_publish_events(publication_id,event_type,detail)
        values(${row.id},'published',${JSON.stringify({ platform: row.platform })}::jsonb)`;
      results.push({ id: row.id, status: 'published' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown publishing error';
      await sql`
        update marketing_publications
        set status='failed', last_error=${message}, updated_at=now()
        where id=${row.id}
      `;
      await sql`insert into marketing_publish_events(publication_id,event_type,detail)
        values(${row.id},'failed',${JSON.stringify({ platform: row.platform, error: message })}::jsonb)`;
      results.push({ id: row.id, status: 'failed', error: message });
    }
  }
  return results;
}
