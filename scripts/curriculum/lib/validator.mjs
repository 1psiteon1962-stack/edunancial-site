// scripts/curriculum/lib/validator.mjs
import {
  ANSWER_KEY_INDICATORS,
  OFFICIAL_TRACK_NAMES,
  REQUIRED_BATCH_VERIFICATION_SECTIONS,
  REQUIRED_LESSON_SECTIONS,
  REQUIRED_MANIFEST_SECTIONS,
  REQUIRED_METADATA_FIELDS,
  REQUIRED_NON_LESSON_METADATA_FIELDS,
} from './taxonomy.mjs';
import { parseAssetId } from './id-parser.mjs';

/**
 * Parse the front-matter metadata block from a markdown file content.
 * Expects block like:
 * ---
 * id: RED-L1-001
 * track: RED
 * ...
 * ---
 */
export function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colonIdx = line.indexOf(':');
    if (colonIdx < 0) {
      continue;
    }
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key) {
      meta[key] = value;
    }
  }
  return meta;
}

function validateCommonMetadata(meta, declaredId, errors) {
  if (!meta.id) {
    return null;
  }

  const parsed = parseAssetId(meta.id);
  if (!parsed.valid) {
    errors.push(`Invalid asset ID "${meta.id}": ${parsed.error}`);
    return null;
  }

  if (declaredId && meta.id !== declaredId) {
    errors.push(`ID mismatch: front-matter id="${meta.id}" but declared ID is "${declaredId}"`);
  }
  if (meta.track && meta.track !== parsed.track) {
    errors.push(`Track mismatch: front-matter track="${meta.track}" but ID implies track="${parsed.track}"`);
  }
  if (meta.officialTrackName) {
    const expected = OFFICIAL_TRACK_NAMES[parsed.track];
    if (meta.officialTrackName !== expected) {
      errors.push(`officialTrackName must be "${expected}" for track ${parsed.track}, got "${meta.officialTrackName}"`);
    }
  }
  if (meta.level && Number.parseInt(meta.level, 10) !== parsed.level) {
    errors.push(`Level mismatch: front-matter level=${meta.level} but ID implies level=${parsed.level}`);
  }
  if (parsed.type === 'lesson' && meta.lessonNumber && Number.parseInt(meta.lessonNumber, 10) !== parsed.number) {
    errors.push(`lessonNumber mismatch: front-matter lessonNumber=${meta.lessonNumber} but ID implies ${parsed.number}`);
  }

  return parsed;
}

function validateSections(content, sections, errors) {
  for (const section of sections) {
    if (!content.includes(section)) {
      errors.push(`Missing required section: "${section}"`);
    }
  }
}

export function validateLesson(content, declaredId) {
  const errors = [];
  const warnings = [];

  const meta = parseFrontMatter(content);
  if (!meta) {
    errors.push('Missing front-matter block (expected --- ... --- at start of file)');
    return { valid: false, errors, warnings, meta: null };
  }

  for (const field of REQUIRED_METADATA_FIELDS) {
    if (!meta[field]) {
      errors.push(`Missing required metadata field: "${field}"`);
    }
  }

  validateCommonMetadata(meta, declaredId, errors);
  validateSections(content, REQUIRED_LESSON_SECTIONS, errors);

  for (const indicator of ANSWER_KEY_INDICATORS) {
    if (content.includes(indicator)) {
      errors.push(`ANSWER KEY VIOLATION: Lesson body contains answer key indicator "${indicator}". Answer keys must be in a separate file.`);
    }
  }

  return { valid: errors.length === 0, errors, warnings, meta };
}

export function validateManifest(content, declaredId) {
  const errors = [];
  const warnings = [];

  const meta = parseFrontMatter(content);
  if (!meta) {
    errors.push('Missing front-matter block (expected --- ... --- at start of file)');
    return { valid: false, errors, warnings, meta: null };
  }

  for (const field of REQUIRED_NON_LESSON_METADATA_FIELDS) {
    if (!meta[field]) {
      errors.push(`Missing required metadata field: "${field}"`);
    }
  }

  const parsed = validateCommonMetadata(meta, declaredId, errors);
  if (parsed && parsed.type !== 'manifest') {
    errors.push(`Asset type mismatch: expected manifest asset ID, received ${parsed.type}`);
  }
  validateSections(content, REQUIRED_MANIFEST_SECTIONS, errors);

  return { valid: errors.length === 0, errors, warnings, meta };
}

export function validateBatchVerification(content, declaredId) {
  const errors = [];
  const warnings = [];

  const meta = parseFrontMatter(content);
  if (!meta) {
    errors.push('Missing front-matter block (expected --- ... --- at start of file)');
    return { valid: false, errors, warnings, meta: null };
  }

  for (const field of REQUIRED_NON_LESSON_METADATA_FIELDS) {
    if (!meta[field]) {
      errors.push(`Missing required metadata field: "${field}"`);
    }
  }

  const parsed = validateCommonMetadata(meta, declaredId, errors);
  if (parsed && parsed.type !== 'batch-verification') {
    errors.push(`Asset type mismatch: expected batch verification asset ID, received ${parsed.type}`);
  }
  validateSections(content, REQUIRED_BATCH_VERIFICATION_SECTIONS, errors);

  return { valid: errors.length === 0, errors, warnings, meta };
}

export function validateAsset(content, declaredId) {
  const meta = parseFrontMatter(content);
  if (!meta || !meta.id) {
    return {
      valid: false,
      errors: ['Cannot determine asset ID: missing front-matter or "id" field'],
      warnings: [],
      meta,
    };
  }

  const parsed = parseAssetId(meta.id);
  if (!parsed.valid) {
    return {
      valid: false,
      errors: [`Invalid asset ID "${meta.id}": ${parsed.error}`],
      warnings: [],
      meta,
    };
  }

  if (parsed.type === 'manifest') {
    return validateManifest(content, declaredId);
  }
  if (parsed.type === 'batch-verification') {
    return validateBatchVerification(content, declaredId);
  }
  return validateLesson(content, declaredId);
}
