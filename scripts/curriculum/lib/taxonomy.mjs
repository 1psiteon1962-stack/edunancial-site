// scripts/curriculum/lib/taxonomy.mjs
// Locked taxonomy - must not be changed without authorization

export const TRACKS = Object.freeze({
  RED:    { code: 'RED',    name: 'Real Estate' },
  WHITE:  { code: 'WHITE',  name: 'Paper Assets' },
  BLUE:   { code: 'BLUE',   name: 'Business' },
  GREEN:  { code: 'GREEN',  name: 'Taxes' },
  GOLD:   { code: 'GOLD',   name: 'Investing' },
  PURPLE: { code: 'PURPLE', name: 'Law' },
  ORANGE: { code: 'ORANGE', name: 'Sales & Marketing' },
  BLACK:  { code: 'BLACK',  name: 'Leadership & Executive Management' },
});

export const TRACK_CODES = Object.keys(TRACKS);

/** Pattern for a lesson ID: TRACK-L{level}-{number} */
export const LESSON_ID_PATTERN = /^(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-9])-([0-9]{3})$/;

/** Pattern for a manifest ID */
export const MANIFEST_ID_PATTERN = /^(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-9])-MANIFEST$/;

/** Pattern for batch verification ID */
export const BATCH_VERIFICATION_ID_PATTERN = /^(RED|WHITE|BLUE|GREEN|GOLD|PURPLE|ORANGE|BLACK)-L([1-9])-BATCH-VERIFICATION$/;

/** Valid track names (official) */
export const OFFICIAL_TRACK_NAMES = Object.freeze(
  Object.fromEntries(Object.values(TRACKS).map((track) => [track.code, track.name]))
);

/** Forbidden file types for ZIP import */
export const FORBIDDEN_EXTENSIONS = new Set([
  '.exe', '.dll', '.so', '.dylib', '.bin', '.sh', '.bat', '.cmd',
  '.ps1', '.vbs', '.js', '.mjs', '.cjs', '.py', '.rb', '.pl',
  '.php', '.jar', '.war', '.ear', '.class',
]);

/** Maximum total extraction size: 100 MB */
export const MAX_ZIP_EXTRACT_SIZE = 100 * 1024 * 1024;

/** Maximum individual file size: 10 MB */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Required metadata fields in a lesson file front-matter */
export const REQUIRED_METADATA_FIELDS = [
  'id', 'track', 'officialTrackName', 'level', 'lessonNumber', 'title', 'version', 'author', 'date',
];

/** Required metadata fields for manifests and verification assets */
export const REQUIRED_NON_LESSON_METADATA_FIELDS = [
  'id', 'track', 'officialTrackName', 'level', 'title', 'version', 'author', 'date',
];

/** Required section headings in a lesson file */
export const REQUIRED_LESSON_SECTIONS = [
  'Learning Objectives', 'Core Content',
];

/** Required section headings in a manifest file */
export const REQUIRED_MANIFEST_SECTIONS = [
  'Included Lessons', 'Release Notes',
];

/** Required section headings in a batch verification file */
export const REQUIRED_BATCH_VERIFICATION_SECTIONS = [
  'Verification Summary', 'Checklist',
];

/** Answer-key indicators that MUST NOT appear in lesson body */
export const ANSWER_KEY_INDICATORS = [
  'ANSWER KEY', 'Answer Key', 'CORRECT ANSWER', 'Correct Answer:',
  'ANSWERS:', '## Answers', '### Answers',
];
