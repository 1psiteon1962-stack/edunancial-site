import { supabaseSelect } from '@/lib/supabase/server';
import type { JurisdictionRepository } from './engine';
import type { AuthoritySource, JurisdictionRule } from './types';

type RuleRow = {
  id: string;
  jurisdiction: string;
  subdivision_code: string | null;
  topics: string[] | null;
  statement: string;
  source_ids: string[] | null;
  effective_from: string | null;
  effective_to: string | null;
  risk: JurisdictionRule['risk'];
  verification_status: JurisdictionRule['verificationStatus'];
  confidence: number;
};

type SourceRow = {
  id: string;
  jurisdiction: string;
  authority: string;
  title: string;
  url: string;
  source_type: AuthoritySource['sourceType'];
  effective_from: string | null;
  effective_to: string | null;
  last_verified_at: string | null;
};

function mapRule(row: RuleRow): JurisdictionRule {
  return {
    id: row.id,
    jurisdiction: row.jurisdiction,
    subdivisionCode: row.subdivision_code ?? undefined,
    topics: row.topics ?? [],
    statement: row.statement,
    sourceIds: row.source_ids ?? [],
    effectiveFrom: row.effective_from ?? undefined,
    effectiveTo: row.effective_to ?? undefined,
    risk: row.risk,
    verificationStatus: row.verification_status,
    confidence: row.confidence,
  };
}

function mapSource(row: SourceRow): AuthoritySource {
  return {
    id: row.id,
    jurisdiction: row.jurisdiction,
    authority: row.authority,
    title: row.title,
    url: row.url,
    sourceType: row.source_type,
    effectiveFrom: row.effective_from ?? undefined,
    effectiveTo: row.effective_to ?? undefined,
    lastVerifiedAt: row.last_verified_at ?? undefined,
  };
}

/** Server-only production adapter. Engine performs final verification/effective-date checks. */
export class SupabaseJurisdictionRepository implements JurisdictionRepository {
  async findRules(input: { jurisdiction: string; subdivisionCode?: string; topics: string[]; asOf: string }): Promise<JurisdictionRule[]> {
    const country = input.jurisdiction.trim().toUpperCase();
    if (!country || input.topics.length === 0) return [];

    // Query country-wide candidates, then filter subdivision/topics in process.
    // This deliberately avoids applying a subdivision rule when no subdivision was selected.
    const rows = await supabaseSelect<RuleRow>('jurisdiction_rules', {
      filters: { jurisdiction: country },
      limit: 500,
    });
    const subdivision = input.subdivisionCode?.trim().toUpperCase();
    const wantedTopics = new Set(input.topics);

    return rows.filter((row) => {
      const rowSubdivision = row.subdivision_code?.trim().toUpperCase();
      if (rowSubdivision && (!subdivision || rowSubdivision !== subdivision)) return false;
      return (row.topics ?? []).some((topic) => wantedTopics.has(topic));
    }).map(mapRule);
  }

  async findSources(ids: string[]): Promise<AuthoritySource[]> {
    if (ids.length === 0) return [];
    // The generic REST helper supports equality filters only, so fetch the bounded
    // source set and retain exactly the source IDs referenced by candidate rules.
    const rows = await supabaseSelect<SourceRow>('jurisdiction_authority_sources', { limit: 1000 });
    const wanted = new Set(ids);
    return rows.filter((row) => wanted.has(row.id)).map(mapSource);
  }
}
