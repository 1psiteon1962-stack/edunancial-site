// scripts/curriculum/tests/curriculum.test.mjs
// Tests for the curriculum management system using node:test

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { checksumBuffer } from '../lib/checksum.mjs';
import { assetPath, parseAssetId } from '../lib/id-parser.mjs';
import { ANSWER_KEY_INDICATORS, FORBIDDEN_EXTENSIONS, TRACKS } from '../lib/taxonomy.mjs';
import { parseFrontMatter, validateLesson } from '../lib/validator.mjs';
import { extractZip } from '../lib/zip.mjs';

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
