// scripts/curriculum/lib/id-parser.mjs
import {
  LESSON_ID_PATTERN,
  MANIFEST_ID_PATTERN,
  BATCH_VERIFICATION_ID_PATTERN,
  TRACKS,
} from './taxonomy.mjs';

/**
 * Parse and validate a curriculum asset ID.
 * Returns { valid, type, track, level, number, error }
 */
export function parseAssetId(id) {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'ID must be a non-empty string' };
  }

  const lessonMatch = id.match(LESSON_ID_PATTERN);
  if (lessonMatch) {
    const [, track, level, number] = lessonMatch;
    if (!TRACKS[track]) {
      return { valid: false, error: `Unknown track: ${track}` };
    }
    return {
      valid: true,
      type: 'lesson',
      track,
      trackName: TRACKS[track].name,
      level: parseInt(level, 10),
      number: parseInt(number, 10),
      numberStr: number,
      id,
    };
  }

  const manifestMatch = id.match(MANIFEST_ID_PATTERN);
  if (manifestMatch) {
    const [, track, level] = manifestMatch;
    return {
      valid: true,
      type: 'manifest',
      track,
      trackName: TRACKS[track].name,
      level: parseInt(level, 10),
      id,
    };
  }

  const batchMatch = id.match(BATCH_VERIFICATION_ID_PATTERN);
  if (batchMatch) {
    const [, track, level] = batchMatch;
    return {
      valid: true,
      type: 'batch-verification',
      track,
      trackName: TRACKS[track].name,
      level: parseInt(level, 10),
      id,
    };
  }

  return {
    valid: false,
    error: `ID "${id}" does not match any recognized pattern (TRACK-L{n}-{nnn}, TRACK-L{n}-MANIFEST, TRACK-L{n}-BATCH-VERIFICATION)`,
  };
}

/** Validate an asset ID, throw on invalid */
export function requireValidId(id) {
  const parsed = parseAssetId(id);
  if (!parsed.valid) {
    throw new Error(`Invalid asset ID: ${parsed.error}`);
  }
  return parsed;
}

/** Generate canonical filename for an asset */
export function assetFilename(id) {
  return `${id}.md`;
}

/** Generate canonical relative path for an asset */
export function assetPath(parsed) {
  if (parsed.type === 'lesson') {
    return `content/curriculum/${parsed.track}/L${parsed.level}/${parsed.id}.md`;
  }
  if (parsed.type === 'manifest') {
    return `curriculum/manifests/${parsed.id}.md`;
  }
  if (parsed.type === 'batch-verification') {
    return `curriculum/verification/${parsed.id}.md`;
  }
  throw new Error(`Unknown asset type: ${parsed.type}`);
}
