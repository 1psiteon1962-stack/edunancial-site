import assert from 'node:assert/strict';
import test from 'node:test';
import type { JurisdictionRepository } from './engine';
import { SupabaseJurisdictionRepository } from './supabase-repository';

test('Supabase jurisdiction repository satisfies the engine boundary', () => {
  const repository: JurisdictionRepository = new SupabaseJurisdictionRepository();
  assert.equal(typeof repository.findRules, 'function');
  assert.equal(typeof repository.findSources, 'function');
});
