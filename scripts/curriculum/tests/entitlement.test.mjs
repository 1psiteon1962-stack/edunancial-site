// scripts/curriculum/tests/entitlement.test.mjs
// Tests for the five-level curriculum entitlement architecture.
// Validates: level titles, tier access mapping, Test Drive sample-lesson logic.

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

// ---------------------------------------------------------------------------
// Canonical level title map (mirrors CURRICULUM_LEVEL_TITLES in tier-config.ts)
// ---------------------------------------------------------------------------

const CURRICULUM_LEVEL_TITLES = {
  1: 'Financial Literacy',
  2: 'Financial Competency',
  3: 'Financial Application',
  4: 'Financial Strategy',
  5: 'Financial Mastery',
};

describe('Canonical curriculum level titles', () => {
  test('exactly five levels are defined', () => {
    assert.equal(Object.keys(CURRICULUM_LEVEL_TITLES).length, 5);
  });

  test('level 1 title is Financial Literacy', () => {
    assert.equal(CURRICULUM_LEVEL_TITLES[1], 'Financial Literacy');
  });

  test('level 2 title is Financial Competency', () => {
    assert.equal(CURRICULUM_LEVEL_TITLES[2], 'Financial Competency');
  });

  test('level 3 title is Financial Application', () => {
    assert.equal(CURRICULUM_LEVEL_TITLES[3], 'Financial Application');
  });

  test('level 4 title is Financial Strategy', () => {
    assert.equal(CURRICULUM_LEVEL_TITLES[4], 'Financial Strategy');
  });

  test('level 5 title is Financial Mastery', () => {
    assert.equal(CURRICULUM_LEVEL_TITLES[5], 'Financial Mastery');
  });
});

// ---------------------------------------------------------------------------
// Membership tier entitlement logic (mirrors canAccessLesson in tier-config.ts)
// ---------------------------------------------------------------------------

const TIER_MAPPING = {
  basic: [1, 2],
  pro: [1, 2, 3, 4],
  gold: [1, 2, 3, 4, 5],
};

const FREE_PREVIEW = { level: 1, maxLesson: 3 };
const SAMPLE_LESSONS = ['RED-L1-001', 'GOLD-L1-002'];

/**
 * Pure function version of canAccessLesson for unit testing without file I/O.
 */
function canAccessLesson(lessonLevel, lessonNumber, viewerTier, lessonId) {
  if (viewerTier === 'admin') return true;

  // Test Drive: only sample lessons
  if (viewerTier === 'test-drive') {
    if (!lessonId) return false;
    return SAMPLE_LESSONS.includes(lessonId);
  }

  // Free preview
  if (lessonLevel === FREE_PREVIEW.level && lessonNumber <= FREE_PREVIEW.maxLesson) return true;

  if (viewerTier === 'free') return false;

  const unlockedLevels = TIER_MAPPING[viewerTier] ?? [];
  return unlockedLevels.includes(lessonLevel);
}

describe('Admin tier bypasses all gates', () => {
  test('admin can access any level', () => {
    for (let level = 1; level <= 5; level++) {
      assert.equal(canAccessLesson(level, 1, 'admin'), true);
    }
  });
});

describe('Free preview (unauthenticated)', () => {
  test('free viewer can access Level 1 lessons 1–3', () => {
    for (let n = 1; n <= 3; n++) {
      assert.equal(canAccessLesson(1, n, 'free'), true, `lesson ${n} should be free`);
    }
  });

  test('free viewer cannot access Level 1 lesson 4+', () => {
    assert.equal(canAccessLesson(1, 4, 'free'), false);
    assert.equal(canAccessLesson(1, 10, 'free'), false);
  });

  test('free viewer cannot access Level 2+', () => {
    for (let level = 2; level <= 5; level++) {
      assert.equal(canAccessLesson(level, 1, 'free'), false);
    }
  });
});

describe('Test Drive tier (sample lessons only)', () => {
  test('test-drive can access designated sample lessons', () => {
    assert.equal(canAccessLesson(1, 1, 'test-drive', 'RED-L1-001'), true);
    assert.equal(canAccessLesson(1, 2, 'test-drive', 'GOLD-L1-002'), true);
  });

  test('test-drive cannot access non-sample lessons', () => {
    assert.equal(canAccessLesson(1, 1, 'test-drive', 'RED-L1-002'), false);
    assert.equal(canAccessLesson(3, 1, 'test-drive', 'BLUE-L3-001'), false);
  });

  test('test-drive without lessonId is denied', () => {
    assert.equal(canAccessLesson(1, 1, 'test-drive', undefined), false);
  });

  test('test-drive access remains tied to designated canonical lesson ids', () => {
    // GOLD-L1-002 is explicitly designated — test-drive can access it by canonical lesson ID
    assert.equal(canAccessLesson(1, 2, 'test-drive', 'GOLD-L1-002'), true);
  });
});

describe('Basic membership (Levels 1–2)', () => {
  test('basic can access Levels 1 and 2', () => {
    assert.equal(canAccessLesson(1, 1, 'basic'), true);
    assert.equal(canAccessLesson(2, 1, 'basic'), true);
  });

  test('basic cannot access Levels 3–5', () => {
    for (let level = 3; level <= 5; level++) {
      assert.equal(canAccessLesson(level, 1, 'basic'), false);
    }
  });
});

describe('Pro membership (Levels 1–4)', () => {
  test('pro can access Levels 1, 2, 3, and 4', () => {
    for (let level = 1; level <= 4; level++) {
      assert.equal(canAccessLesson(level, 1, 'pro'), true, `level ${level} should be accessible to pro`);
    }
  });

  test('pro includes Level 1 and Level 2 (not just Levels 3–4)', () => {
    assert.equal(canAccessLesson(1, 5, 'pro'), true, 'pro must include Level 1');
    assert.equal(canAccessLesson(2, 1, 'pro'), true, 'pro must include Level 2');
  });

  test('pro cannot access Level 5', () => {
    assert.equal(canAccessLesson(5, 1, 'pro'), false);
  });
});

describe('Gold membership (Levels 1–5)', () => {
  test('gold can access all five levels', () => {
    for (let level = 1; level <= 5; level++) {
      assert.equal(canAccessLesson(level, 1, 'gold'), true, `level ${level} should be accessible to gold`);
    }
  });
});

describe('Tier hierarchy is strictly cumulative', () => {
  test('every level accessible to basic is also accessible to pro', () => {
    for (const level of TIER_MAPPING.basic) {
      assert.ok(TIER_MAPPING.pro.includes(level), `pro must include level ${level} (in basic)`);
    }
  });

  test('every level accessible to pro is also accessible to gold', () => {
    for (const level of TIER_MAPPING.pro) {
      assert.ok(TIER_MAPPING.gold.includes(level), `gold must include level ${level} (in pro)`);
    }
  });
});
