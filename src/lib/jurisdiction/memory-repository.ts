import type { JurisdictionRepository } from './engine';
import type { AuthoritySource, JurisdictionRule } from './types';

/**
 * Deterministic repository used by the jurisdiction engine. Production storage
 * adapters (Supabase/database) can implement the same interface without changing
 * AI orchestration. This keeps model generation separate from regulatory truth.
 */
export class MemoryJurisdictionRepository implements JurisdictionRepository {
  constructor(
    private readonly rules: JurisdictionRule[] = [],
    private readonly sources: AuthoritySource[] = [],
  ) {}

  async findRules(input: {
    jurisdiction: string;
    subdivisionCode?: string;
    topics: string[];
    asOf: string;
  }): Promise<JurisdictionRule[]> {
    const country = input.jurisdiction.trim().toUpperCase();
    const subdivision = input.subdivisionCode?.trim().toUpperCase();
    const topics = new Set(input.topics);

    return this.rules.filter(rule => {
      if (rule.jurisdiction.trim().toUpperCase() !== country) return false;

      if (subdivision) {
        // Include country-wide rules plus rules for the selected subdivision.
        if (rule.subdivisionCode && rule.subdivisionCode.trim().toUpperCase() !== subdivision) return false;
      } else if (rule.subdivisionCode) {
        // Never apply a state/province rule when no subdivision was selected.
        return false;
      }

      return rule.topics.some(topic => topics.has(topic));
    });
  }

  async findSources(ids: string[]): Promise<AuthoritySource[]> {
    const wanted = new Set(ids);
    return this.sources.filter(source => wanted.has(source.id));
  }
}
