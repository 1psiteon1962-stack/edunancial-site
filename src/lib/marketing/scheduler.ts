import { getNeonSql } from '@/lib/db/neon';
import { publisherFor } from './publishers';
import type { MarketingPlatform, PublishRequest } from './types';
import { recordMarketingFunnelEvent } from './s8-funnel';

type DuePublication = {
  id: string; platform: MarketingPlatform; platform_copy: string; media_refs: unknown;
  scheduled_for: string; attempt_count: number; social_account_id: string | null;
  provider: string | null; connection_status: string | null; campaign_id:string; content_id:string; locale:string;
};

function mediaRefs(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

export async function publishDueMarketing(now = new Date()) {
  const sql = getNeonSql();
  if (!sql) throw new Error('Marketing scheduler requires DATABASE_URL or NETLIFY_DATABASE_URL.');

  const due = await sql`
    select p.id,p.platform,p.platform_copy,p.media_refs,p.scheduled_for,p.attempt_count,
           p.social_account_id,a.provider,a.connection_status,c.campaign_id,c.id as content_id,c.locale
    from marketing_publications p
    join marketing_content c on c.id=p.content_id
    left join marketing_social_accounts a on a.id=p.social_account_id
    where p.status='scheduled' and p.scheduled_for <= ${now.toISOString()}
    order by p.scheduled_for asc limit 25
  ` as DuePublication[];

  const results: Array<{ id:string; status:'published'|'failed'; error?:string }> = [];
  for (const row of due) {
    if (!row.social_account_id || row.connection_status !== 'connected' || !row.provider) {
      const message = 'No connected social account/provider is assigned to this publication.';
      await sql`update marketing_publications set status='failed',last_error=${message},updated_at=now() where id=${row.id}`;
      results.push({id:row.id,status:'failed',error:message});
      continue;
    }

    const claimed = await sql`update marketing_publications set status='publishing',attempt_count=attempt_count+1,updated_at=now()
      where id=${row.id} and status='scheduled' returning id`;
    if (claimed.length===0) continue;

    const request: PublishRequest = { publicationId:row.id, platform:row.platform, socialAccountId:row.social_account_id,
      copy:row.platform_copy, mediaRefs:mediaRefs(row.media_refs), scheduledFor:row.scheduled_for };
    try {
      const result=await publisherFor(row.platform).publish(request);
      await sql`update marketing_publications set status='published',provider=${row.provider},
        provider_publication_id=${result.providerPublicationId},published_at=${result.publishedAt},last_error=null,updated_at=now()
        where id=${row.id}`;
      await sql`insert into marketing_publish_events(publication_id,event_type,detail)
        values(${row.id},'published',${JSON.stringify({platform:row.platform,provider:row.provider})}::jsonb)`;
      await recordMarketingFunnelEvent({campaignId:row.campaign_id,contentId:row.content_id,publicationId:row.id,stage:'message',eventType:'published',locale:row.locale,platform:row.platform,metadata:{provider:row.provider}});
      results.push({id:row.id,status:'published'});
    } catch(error) {
      const message=error instanceof Error ? error.message : 'Unknown publishing error';
      await sql`update marketing_publications set status='failed',last_error=${message},updated_at=now() where id=${row.id}`;
      await sql`insert into marketing_publish_events(publication_id,event_type,detail)
        values(${row.id},'failed',${JSON.stringify({platform:row.platform,provider:row.provider,error:message})}::jsonb)`;
      results.push({id:row.id,status:'failed',error:message});
    }
  }
  return results;
}
