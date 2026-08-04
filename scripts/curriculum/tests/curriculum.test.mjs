// scripts/curriculum/tests/curriculum.test.mjs
// Tests for the curriculum management system using node:test

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { checksumBuffer } from '../lib/checksum.mjs';
import { assetPath, parseAssetId } from '../lib/id-parser.mjs';
import { ANSWER_KEY_INDICATORS, FORBIDDEN_EXTENSIONS, TRACKS } from '../lib/taxonomy.mjs';
import { parseFrontMatter, validateLesson } from '../lib/validator.mjs';
import { extractZip } from '../lib/zip.mjs';
import { isAllowedCurriculumAsset, ALLOWED_EXTENSIONS, EXCLUDED_DIRECTORY_SEGMENTS } from '../lib/export-filter.mjs';

describe('parseAssetId', () => {
  test('parses valid lesson ID', () => {
    const result = parseAssetId('RED-L1-001');
    assert.equal(result.valid, true);
    assert.equal(result.type, 'lesson');
    assert.equal(result.track, 'RED');
    assert.equal(result.level, 1);
    assert.equal(result.number, 1);
    assert.equal(result.trackName, 'Real Estate');
  });

  test('parses valid manifest ID', () => {
    const result = parseAssetId('WHITE-L2-MANIFEST');
    assert.equal(result.valid, true);
    assert.equal(result.type, 'manifest');
    assert.equal(result.track, 'WHITE');
    assert.equal(result.level, 2);
  });

  test('parses required WHITE curriculum lesson pattern', () => {
    const result = parseAssetId('WHITE-L3-008');
    assert.equal(result.valid, true);
    assert.equal(result.type, 'lesson');
    assert.equal(result.track, 'WHITE');
    assert.equal(result.level, 3);
    assert.equal(result.number, 8);
  });

  test('parses required BLUE curriculum lesson pattern', () => {
    const result = parseAssetId('BLUE-L5-010');
    assert.equal(result.valid, true);
    assert.equal(result.type, 'lesson');
    assert.equal(result.track, 'BLUE');
    assert.equal(result.level, 5);
    assert.equal(result.number, 10);
  });

  test('parses valid batch-verification ID', () => {
    const result = parseAssetId('BLUE-L1-BATCH-VERIFICATION');
    assert.equal(result.valid, true);
    assert.equal(result.type, 'batch-verification');
    assert.equal(result.track, 'BLUE');
  });

  test('rejects invalid track', () => {
    const result = parseAssetId('PINK-L1-001');
    assert.equal(result.valid, false);
  });

  test('rejects missing level', () => {
    const result = parseAssetId('RED-001');
    assert.equal(result.valid, false);
  });

  test('rejects wrong number format', () => {
    const result = parseAssetId('RED-L1-01');
    assert.equal(result.valid, false);
  });

  test('rejects empty string', () => {
    const result = parseAssetId('');
    assert.equal(result.valid, false);
  });

  test('assetPath returns canonical lesson path', () => {
    const parsed = parseAssetId('RED-L1-001');
    assert.equal(assetPath(parsed), 'content/curriculum/RED/L1/RED-L1-001.md');
  });

  test('assetPath returns canonical manifest path', () => {
    const parsed = parseAssetId('RED-L1-MANIFEST');
    assert.equal(assetPath(parsed), 'curriculum/manifests/RED-L1-MANIFEST.md');
  });
});

describe('taxonomy', () => {
  test('has all 8 tracks', () => {
    assert.equal(Object.keys(TRACKS).length, 8);
  });

  test('locked taxonomy names remain correct', () => {
    assert.equal(TRACKS.RED.name, 'Real Estate');
    assert.equal(TRACKS.WHITE.name, 'Paper Assets');
    assert.equal(TRACKS.BLUE.name, 'Business');
    assert.equal(TRACKS.GREEN.name, 'Taxes');
    assert.equal(TRACKS.GOLD.name, 'Investing');
    assert.equal(TRACKS.PURPLE.name, 'Law');
    assert.equal(TRACKS.ORANGE.name, 'Sales & Marketing');
    assert.equal(TRACKS.BLACK.name, 'Leadership & Executive Management');
  });
});

describe('validateLesson', () => {
  function makeLesson(overrides = {}) {
    const meta = {
      id: 'RED-L1-001',
      track: 'RED',
      officialTrackName: 'Real Estate',
      level: '1',
      lessonNumber: '1',
      title: 'Introduction to Real Estate',
      version: '1.0',
      author: 'Test Author',
      date: '2026-07-11',
      regionalStatus: 'GLOBAL CORE',
      ...overrides,
    };
    const frontMatter = Object.entries(meta)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    return `---\n${frontMatter}\n---\n\n## Learning Objectives\n\n- Objective 1\n\n## Core Content\n\nContent here.\n`;
  }

  test('passes valid lesson', () => {
    const result = validateLesson(makeLesson(), 'RED-L1-001');
    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, []);
  });

  test('fails missing front-matter', () => {
    const result = validateLesson('# No front matter\n\nContent', 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('front-matter')));
  });

  test('fails wrong officialTrackName', () => {
    const result = validateLesson(makeLesson({ officialTrackName: 'Wrong Name' }), 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('officialTrackName')));
  });

  test('fails ID mismatch', () => {
    const result = validateLesson(makeLesson({ id: 'RED-L1-002' }), 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('mismatch')));
  });

  test('fails missing Learning Objectives section', () => {
    const content = makeLesson().replace('## Learning Objectives\n\n- Objective 1\n\n', '');
    const result = validateLesson(content, 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('Learning Objectives')));
  });

  test('fails missing Core Content section', () => {
    const content = makeLesson().replace('## Core Content\n\nContent here.\n', '');
    const result = validateLesson(content, 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('Core Content')));
  });

  test('fails answer key in lesson body', () => {
    const content = `${makeLesson()}\n## ANSWER KEY\n1. A\n2. B\n`;
    const result = validateLesson(content, 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('ANSWER KEY VIOLATION')));
  });

  test('fails wrong official track name for ORANGE lesson', () => {
    const content = makeLesson({
      track: 'ORANGE',
      id: 'ORANGE-L1-001',
      officialTrackName: 'Orange Track',
    });
    const result = validateLesson(content, 'ORANGE-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('officialTrackName')));
  });

  test('fails level mismatch', () => {
    const result = validateLesson(makeLesson({ level: '2' }), 'RED-L1-001');
    assert.equal(result.valid, false);
    assert(result.errors.some((error) => error.includes('Level mismatch')));
  });
});

describe('checksumBuffer', () => {
  test('returns sha256: prefixed string', () => {
    const checksum = checksumBuffer(Buffer.from('hello'));
    assert(checksum.startsWith('sha256:'));
    assert.equal(checksum.length, 71);
  });

  test('same content same checksum', () => {
    assert.equal(checksumBuffer(Buffer.from('test content')), checksumBuffer(Buffer.from('test content')));
  });

  test('different content different checksum', () => {
    assert.notEqual(checksumBuffer(Buffer.from('content A')), checksumBuffer(Buffer.from('content B')));
  });
});

describe('extractZip', () => {
  test('rejects invalid ZIP buffer', () => {
    assert.throws(() => extractZip(Buffer.from('not a zip file')), /Invalid ZIP/);
  });

  test('forbidden extensions remain blocked', () => {
    assert(FORBIDDEN_EXTENSIONS.has('.exe'));
    assert(FORBIDDEN_EXTENSIONS.has('.sh'));
    assert(FORBIDDEN_EXTENSIONS.has('.dll'));
  });

  test('answer key indicators contain expected values', () => {
    assert(ANSWER_KEY_INDICATORS.includes('ANSWER KEY'));
    assert(ANSWER_KEY_INDICATORS.includes('## Answers'));
  });
});

describe('parseFrontMatter', () => {
  test('parses valid front-matter', () => {
    const content = '---\nid: RED-L1-001\ntitle: Test\n---\n\nContent';
    const meta = parseFrontMatter(content);
    assert.equal(meta.id, 'RED-L1-001');
    assert.equal(meta.title, 'Test');
  });

  test('returns null for missing front-matter', () => {
    assert.equal(parseFrontMatter('# No front matter'), null);
  });

  test('handles colons in values', () => {
    const content = '---\ndate: 2026-07-11\ntitle: Real Estate: Introduction\n---\n';
    const meta = parseFrontMatter(content);
    assert.equal(meta.date, '2026-07-11');
    assert.equal(meta.title, 'Real Estate: Introduction');
  });

  test('preserves extra metadata fields for registry ingestion', () => {
    const content = '---\nid: RED-L1-001\nregionalStatus: NORTH_AMERICA\ncurriculumType: adaptive\n---\n';
    const meta = parseFrontMatter(content);
    assert.equal(meta.regionalStatus, 'NORTH_AMERICA');
    assert.equal(meta.curriculumType, 'adaptive');
  });
});

// ---------------------------------------------------------------------------
// Tier-based access gate logic (validates behavior without file I/O)
// ---------------------------------------------------------------------------

describe('tier access gate', () => {
  // Mirror the logic from src/lib/curriculum/tier-config.ts for unit testing
  function canAccessLesson(level, lessonNumber, viewerTier, config) {
    if (viewerTier === 'admin') return true;
    const fp = config.freePreview;
    if (level === fp.level && lessonNumber <= fp.maxLesson) return true;
    if (viewerTier === 'free') return false;
    const unlockedLevels = config.mapping[viewerTier] ?? [];
    return unlockedLevels.includes(level);
  }

  const defaultConfig = {
    freePreview: { level: 1, maxLesson: 3 },
    mapping: { basic: [1, 2], pro: [1, 2, 3, 4], gold: [1, 2, 3, 4, 5] },
  };

  test('admin bypasses all gating', () => {
    assert.equal(canAccessLesson(5, 10, 'admin', defaultConfig), true);
    assert.equal(canAccessLesson(3, 1, 'admin', defaultConfig), true);
  });

  test('free tier: can access level 1 lessons 001-003', () => {
    assert.equal(canAccessLesson(1, 1, 'free', defaultConfig), true);
    assert.equal(canAccessLesson(1, 2, 'free', defaultConfig), true);
    assert.equal(canAccessLesson(1, 3, 'free', defaultConfig), true);
  });

  test('free tier: cannot access level 1 lesson 004+', () => {
    assert.equal(canAccessLesson(1, 4, 'free', defaultConfig), false);
    assert.equal(canAccessLesson(1, 10, 'free', defaultConfig), false);
  });

  test('free tier: cannot access level 2+', () => {
    assert.equal(canAccessLesson(2, 1, 'free', defaultConfig), false);
    assert.equal(canAccessLesson(3, 1, 'free', defaultConfig), false);
    assert.equal(canAccessLesson(5, 1, 'free', defaultConfig), false);
  });

  test('basic tier: can access level 1 and 2', () => {
    assert.equal(canAccessLesson(1, 4, 'basic', defaultConfig), true);
    assert.equal(canAccessLesson(2, 1, 'basic', defaultConfig), true);
    assert.equal(canAccessLesson(2, 10, 'basic', defaultConfig), true);
  });

  test('basic tier: cannot access level 3+', () => {
    assert.equal(canAccessLesson(3, 1, 'basic', defaultConfig), false);
    assert.equal(canAccessLesson(4, 1, 'basic', defaultConfig), false);
    assert.equal(canAccessLesson(5, 1, 'basic', defaultConfig), false);
  });

  test('pro tier: can access levels 1-4', () => {
    assert.equal(canAccessLesson(3, 1, 'pro', defaultConfig), true);
    assert.equal(canAccessLesson(4, 10, 'pro', defaultConfig), true);
  });

  test('pro tier: cannot access level 5', () => {
    assert.equal(canAccessLesson(5, 1, 'pro', defaultConfig), false);
  });

  test('gold tier: can access all levels 1-5', () => {
    for (let lvl = 1; lvl <= 5; lvl++) {
      assert.equal(canAccessLesson(lvl, 1, 'gold', defaultConfig), true, `gold should access level ${lvl}`);
    }
  });

  test('config is cumulative — tiers include lower tiers', () => {
    // Gold unlocks everything pro does
    const proLevels = defaultConfig.mapping.pro;
    const goldLevels = defaultConfig.mapping.gold;
    for (const lvl of proLevels) {
      assert.ok(goldLevels.includes(lvl), `gold must include level ${lvl} which pro includes`);
    }
    // Pro unlocks everything basic does
    const basicLevels = defaultConfig.mapping.basic;
    for (const lvl of basicLevels) {
      assert.ok(proLevels.includes(lvl), `pro must include level ${lvl} which basic includes`);
    }
  });

  test('free preview boundary is configurable', () => {
    const customConfig = {
      freePreview: { level: 1, maxLesson: 5 },
      mapping: { basic: [1, 2], pro: [1, 2, 3, 4], gold: [1, 2, 3, 4, 5] },
    };
    assert.equal(canAccessLesson(1, 5, 'free', customConfig), true);
    assert.equal(canAccessLesson(1, 6, 'free', customConfig), false);
  });
});

// ── export-filter regression tests ───────────────────────────────────────────

describe('isAllowedCurriculumAsset — allowed files', () => {
  test('allows lesson markdown files', () => {
    assert.equal(isAllowedCurriculumAsset('RED-L1-011.md'), true);
    assert.equal(isAllowedCurriculumAsset('WHITE-L2-MANIFEST.md'), true);
    assert.equal(isAllowedCurriculumAsset('RED/L1/RED-L1-025.md'), true);
  });

  test('allows JSON metadata files', () => {
    assert.equal(isAllowedCurriculumAsset('manifest.json'), true);
    assert.equal(isAllowedCurriculumAsset('RED/L1/registry.json'), true);
  });

  test('allows image files', () => {
    assert.equal(isAllowedCurriculumAsset('images/chart.png'), true);
    assert.equal(isAllowedCurriculumAsset('assets/diagram.svg'), true);
    assert.equal(isAllowedCurriculumAsset('media/photo.jpg'), true);
    assert.equal(isAllowedCurriculumAsset('media/photo.jpeg'), true);
    assert.equal(isAllowedCurriculumAsset('media/photo.gif'), true);
    assert.equal(isAllowedCurriculumAsset('media/photo.webp'), true);
  });

  test('allows approved media files', () => {
    assert.equal(isAllowedCurriculumAsset('media/lesson.mp3'), true);
    assert.equal(isAllowedCurriculumAsset('media/lesson.mp4'), true);
    assert.equal(isAllowedCurriculumAsset('media/lesson.webm'), true);
    assert.equal(isAllowedCurriculumAsset('media/lesson.ogg'), true);
  });

  test('allows PDF reference documents', () => {
    assert.equal(isAllowedCurriculumAsset('reference/handout.pdf'), true);
  });
});

describe('isAllowedCurriculumAsset — disallowed files (regression for commit-red-l1-011-025.sh)', () => {
  test('rejects shell scripts (.sh) — root cause of the reported bug', () => {
    assert.equal(isAllowedCurriculumAsset('red/commit-red-l1-011-025.sh'), false);
    assert.equal(isAllowedCurriculumAsset('reset_deps.sh'), false);
    assert.equal(isAllowedCurriculumAsset('scripts/deploy.sh'), false);
  });

  test('rejects Windows batch and PowerShell scripts', () => {
    assert.equal(isAllowedCurriculumAsset('build.bat'), false);
    assert.equal(isAllowedCurriculumAsset('deploy.cmd'), false);
    assert.equal(isAllowedCurriculumAsset('setup.ps1'), false);
  });

  test('rejects executable and binary files', () => {
    assert.equal(isAllowedCurriculumAsset('tool.exe'), false);
    assert.equal(isAllowedCurriculumAsset('lib.dll'), false);
    assert.equal(isAllowedCurriculumAsset('module.so'), false);
  });

  test('rejects script language files', () => {
    assert.equal(isAllowedCurriculumAsset('helper.py'), false);
    assert.equal(isAllowedCurriculumAsset('helper.rb'), false);
    assert.equal(isAllowedCurriculumAsset('helper.js'), false);
    assert.equal(isAllowedCurriculumAsset('helper.mjs'), false);
  });

  test('rejects hidden dot-files', () => {
    assert.equal(isAllowedCurriculumAsset('.DS_Store'), false);
    assert.equal(isAllowedCurriculumAsset('.gitignore'), false);
    assert.equal(isAllowedCurriculumAsset('RED/.env'), false);
  });

  test('rejects files inside excluded directories', () => {
    assert.equal(isAllowedCurriculumAsset('.git/config'), false);
    assert.equal(isAllowedCurriculumAsset('.github/workflows/ci.yml'), false);
    assert.equal(isAllowedCurriculumAsset('node_modules/lodash/index.js'), false);
    assert.equal(isAllowedCurriculumAsset('dist/bundle.js'), false);
    assert.equal(isAllowedCurriculumAsset('build/output.json'), false);
    assert.equal(isAllowedCurriculumAsset('tmp/scratch.md'), false);
  });
});

describe('isAllowedCurriculumAsset — path separator compatibility', () => {
  test('accepts back-slash separators (Windows paths)', () => {
    assert.equal(isAllowedCurriculumAsset('RED\\L1\\RED-L1-011.md'), true);
    assert.equal(isAllowedCurriculumAsset('red\\commit-red-l1-011-025.sh'), false);
    assert.equal(isAllowedCurriculumAsset('node_modules\\pkg\\index.js'), false);
  });
});

describe('ALLOWED_EXTENSIONS covers all expected curriculum asset types', () => {
  test('contains markdown', () => assert.ok(ALLOWED_EXTENSIONS.has('.md')));
  test('contains json', () => assert.ok(ALLOWED_EXTENSIONS.has('.json')));
  test('contains common image types', () => {
    for (const ext of ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']) {
      assert.ok(ALLOWED_EXTENSIONS.has(ext), `Expected ${ext} in ALLOWED_EXTENSIONS`);
    }
  });
  test('does NOT contain shell script extensions', () => {
    for (const ext of ['.sh', '.bat', '.cmd', '.ps1', '.exe', '.js', '.mjs', '.py']) {
      assert.ok(!ALLOWED_EXTENSIONS.has(ext), `Expected ${ext} NOT in ALLOWED_EXTENSIONS`);
    }
  });
});

describe('EXCLUDED_DIRECTORY_SEGMENTS covers all expected dev directories', () => {
  for (const dir of ['.git', '.github', 'node_modules', 'dist', 'build', '.next', 'tmp', 'temp']) {
    test(`excludes "${dir}" directory`, () => assert.ok(EXCLUDED_DIRECTORY_SEGMENTS.has(dir)));
  }
});
