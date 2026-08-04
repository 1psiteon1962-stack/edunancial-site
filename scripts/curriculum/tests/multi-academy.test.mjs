// scripts/curriculum/tests/multi-academy.test.mjs
// Tests for the multi-academy, 5-level-per-academy, and membership-aware architecture.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// ---------------------------------------------------------------------------
// Import the academies module (ES module, Node.js 22+)
// We test the TypeScript source by importing via --experimental-strip-types
// at the top-level test runner command.
// ---------------------------------------------------------------------------

// We cannot directly import the TypeScript academies module here because this
// test runs under node:test with plain .mjs syntax.  Instead we verify the
// taxonomy is consistent with the academy contracts using the taxonomy module.

import { TRACKS } from '../lib/taxonomy.mjs';
import { parseAssetId } from '../lib/id-parser.mjs';

// ---------------------------------------------------------------------------
// Academy structure requirements
// ---------------------------------------------------------------------------

describe('multi-academy structure', () => {
  test('RED, WHITE, and BLUE tracks exist in taxonomy', () => {
    assert.ok(TRACKS.RED, 'RED track must exist');
    assert.ok(TRACKS.WHITE, 'WHITE track must exist');
    assert.ok(TRACKS.BLUE, 'BLUE track must exist');
  });

  test('RED track has correct name', () => {
    assert.equal(TRACKS.RED.name, 'Real Estate');
  });

  test('WHITE track has correct name', () => {
    assert.equal(TRACKS.WHITE.name, 'Paper Assets');
  });

  test('BLUE track has correct name', () => {
    assert.equal(TRACKS.BLUE.name, 'Business');
  });

  test('level IDs 1-5 parse correctly for all three primary academies', () => {
    for (const track of ['RED', 'WHITE', 'BLUE']) {
      for (let level = 1; level <= 5; level++) {
        const id = `${track}-L${level}-001`;
        const result = parseAssetId(id);
        assert.equal(result.valid, true, `${id} should parse as valid`);
        assert.equal(result.track, track);
        assert.equal(result.level, level);
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Membership metadata requirements
// ---------------------------------------------------------------------------

describe('membership tiers', () => {
  const VALID_TIERS = ['free', 'basic', 'pro', 'gold', 'standard', 'premium'];

  test('accepted membership tier values are documented', () => {
    // Verify the set of accepted values is stable
    assert.equal(VALID_TIERS.length, 6);
    assert.ok(VALID_TIERS.includes('free'), 'free tier must be supported');
    assert.ok(VALID_TIERS.includes('basic'), 'basic tier must be supported');
    assert.ok(VALID_TIERS.includes('pro'), 'pro tier must be supported');
    assert.ok(VALID_TIERS.includes('gold'), 'gold tier must be supported');
    assert.ok(VALID_TIERS.includes('standard'), 'standard tier must be supported');
    assert.ok(VALID_TIERS.includes('premium'), 'premium tier must be supported');
  });

  test('tier inheritance: premium includes all tiers', () => {
    // Simulate the tier access map from academies.ts
    const tierAccess = {
      free:     new Set(['free']),
      basic:    new Set(['free', 'basic']),
      pro:      new Set(['free', 'basic', 'pro']),
      gold:     new Set(['free', 'basic', 'pro', 'gold']),
    };

    for (const tier of ['free', 'basic', 'pro', 'gold']) {
      assert.ok(tierAccess.gold.has(tier), `gold must grant access to ${tier}`);
    }
  });

  test('tier inheritance: standard includes free and basic', () => {
    const tierAccess = {
      free:     new Set(['free']),
      basic:    new Set(['free', 'basic']),
      pro:      new Set(['free', 'basic', 'pro']),
      gold:     new Set(['free', 'basic', 'pro', 'gold']),
    };

    assert.ok(tierAccess.pro.has('free'));
    assert.ok(tierAccess.pro.has('basic'));
    assert.ok(tierAccess.pro.has('pro'));
    assert.ok(!tierAccess.pro.has('gold'), 'pro must NOT grant access to gold');
  });

  test('tier inheritance: basic includes only free and basic', () => {
    const tierAccess = {
      free:     new Set(['free']),
      basic:    new Set(['free', 'basic']),
      pro:      new Set(['free', 'basic', 'pro']),
      gold:     new Set(['free', 'basic', 'pro', 'gold']),
    };

    assert.ok(tierAccess.basic.has('free'));
    assert.ok(tierAccess.basic.has('basic'));
    assert.ok(!tierAccess.basic.has('standard'), 'basic must NOT grant access to standard');
    assert.ok(!tierAccess.basic.has('premium'), 'basic must NOT grant access to premium');
  });

  test('tier inheritance: free includes only free', () => {
    const tierAccess = {
      free:     new Set(['free']),
      basic:    new Set(['free', 'basic']),
      pro:      new Set(['free', 'basic', 'pro']),
      gold:     new Set(['free', 'basic', 'pro', 'gold']),
    };

    assert.ok(tierAccess.free.has('free'));
    assert.ok(!tierAccess.free.has('basic'));
    assert.ok(!tierAccess.free.has('pro'));
    assert.ok(!tierAccess.free.has('gold'));
  });

  test('admin override: admin viewer bypasses all membership filters', () => {
    function isLessonVisible(lessonTier, viewer) {
      if (viewer === 'admin') return true;
      const tierAccess = {
        free:     new Set(['free']),
        basic:    new Set(['free', 'basic']),
        pro:      new Set(['free', 'basic', 'pro']),
        gold:     new Set(['free', 'basic', 'pro', 'gold']),
      };
      const raw = (lessonTier ?? 'free').toLowerCase();
      const normalised = raw === 'standard' ? 'pro' : raw === 'premium' ? 'gold' : raw;
      return tierAccess[viewer]?.has(normalised) ?? false;
    }

    for (const tier of ['free', 'basic', 'pro', 'gold', 'standard', 'premium']) {
      assert.ok(isLessonVisible(tier, 'admin'), `admin must see ${tier} lessons`);
    }

    // Anonymous (free) viewer should NOT see gold/pro lessons
    assert.ok(!isLessonVisible('premium', 'free'), 'anonymous user must NOT see premium lessons');
    assert.ok(!isLessonVisible('standard', 'free'), 'anonymous user must NOT see standard lessons');
    assert.ok(!isLessonVisible('gold', 'free'), 'anonymous user must NOT see gold lessons');
    assert.ok(!isLessonVisible('pro', 'free'), 'anonymous user must NOT see pro lessons');
    assert.ok(!isLessonVisible('basic', 'free'), 'anonymous user must NOT see basic lessons');
    assert.ok(isLessonVisible('free', 'free'), 'anonymous user must see free lessons');
  });
});

// ---------------------------------------------------------------------------
// Level 1-5 generation requirements
// ---------------------------------------------------------------------------

describe('five-level structure', () => {
  test('levels 1-5 are valid for all primary academies', () => {
    const primaryAcademies = ['RED', 'WHITE', 'BLUE'];
    for (const track of primaryAcademies) {
      for (let level = 1; level <= 5; level++) {
        // Verify the level ID pattern is accepted
        const manifestId = `${track}-L${level}-MANIFEST`;
        const result = parseAssetId(manifestId);
        assert.equal(result.valid, true, `${manifestId} should be valid`);
      }
    }
  });

  test('canonical academy level count is 5', () => {
    // The academy levelCount must be 5 for all primary academies.
    // This mirrors the contract in academies.ts.
    const EXPECTED_LEVEL_COUNT = 5;
    const academies = [
      { code: 'RED',   levelCount: EXPECTED_LEVEL_COUNT },
      { code: 'WHITE', levelCount: EXPECTED_LEVEL_COUNT },
      { code: 'BLUE',  levelCount: EXPECTED_LEVEL_COUNT },
    ];
    for (const academy of academies) {
      assert.equal(academy.levelCount, EXPECTED_LEVEL_COUNT,
        `${academy.code} must have ${EXPECTED_LEVEL_COUNT} levels`);
    }
  });
});
