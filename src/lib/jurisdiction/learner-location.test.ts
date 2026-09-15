import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLearnerJurisdiction, suggestedJurisdictionFromSession } from './learner-location';

test('session geolocation may suggest signup jurisdiction but never confirms it', () => {
  const session = { countryCode: 'CA', subdivisionCode: 'ON', source: 'edge' as const, observedAt: new Date().toISOString() };
  assert.deepEqual(suggestedJurisdictionFromSession(session), { countryCode: 'CA', subdivisionCode: 'ON' });
  const result = resolveLearnerJurisdiction({ session, language: 'en' });
  assert.equal(result.requiresConfirmation, true);
  assert.equal(result.selection.countryCode, '');
});

test('confirmed Florida jurisdiction remains authoritative while learner is physically in Canada', () => {
  const result = resolveLearnerJurisdiction({
    confirmed: { countryCode: 'US', subdivisionCode: 'FL', confirmedAt: new Date().toISOString() },
    session: { countryCode: 'CA', subdivisionCode: 'ON', source: 'ip', observedAt: new Date().toISOString() },
    language: 'en',
  });
  assert.equal(result.selection.countryCode, 'US');
  assert.equal(result.selection.subdivisionCode, 'FL');
  assert.equal(result.sessionLocationDiffers, true);
  assert.equal(result.requiresConfirmation, false);
});

test('confirmed Ontario jurisdiction is independent of French display language', () => {
  const result = resolveLearnerJurisdiction({
    confirmed: { countryCode: 'CA', subdivisionCode: 'ON', confirmedAt: new Date().toISOString() },
    session: { countryCode: 'CA', subdivisionCode: 'ON', source: 'edge', observedAt: new Date().toISOString() },
    language: 'fr-CA',
  });
  assert.equal(result.selection.countryCode, 'CA');
  assert.equal(result.selection.subdivisionCode, 'ON');
  assert.equal(result.selection.language, 'fr-CA');
  assert.equal(result.sessionLocationDiffers, false);
});
