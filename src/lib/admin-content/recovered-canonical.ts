export type RecoveredCanonicalIdentity = {
  id: string;
  track: string;
  level: number;
  lessonNumber: number;
  title: string;
};

const TRACK_NAMES: Record<string, string> = {
  RED: "Real Estate",
  WHITE: "Paper Assets",
  BLUE: "Business",
  GREEN: "Personal Finance and Taxes",
  GOLD: "Investing",
  PURPLE: "Law",
  ORANGE: "Sales and Marketing",
  BLACK: "Leadership",
};

function field(content: string, name: string): string {
  const match = content.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, "im"));
  return match?.[1]?.trim() ?? "";
}

export function detectRecoveredCanonicalIdentity(content: string, sourceFilename?: string): RecoveredCanonicalIdentity | null {
  if (content.trimStart().startsWith("---")) return null;
  const filenameField = field(content, "Filename");
  const candidate = filenameField || sourceFilename || "";
  const basename = candidate.split(/[\\/]/u).pop() ?? candidate;
  const match = basename.match(/^([A-Z][A-Z0-9]*)-L([1-9][0-9]*)-([0-9]{3,})\.md$/iu);
  if (!match) return null;
  const track = match[1].toUpperCase();
  if (!TRACK_NAMES[track]) return null;
  const level = Number(match[2]);
  const lessonNumber = Number(match[3]);
  if (!Number.isSafeInteger(level) || !Number.isSafeInteger(lessonNumber) || lessonNumber < 1) return null;
  const id = `${track}-L${level}-${String(lessonNumber).padStart(3, "0")}`;
  const title = field(content, "Title") || content.match(/^#{1,6}\s+(.+?)\s*$/m)?.[1]?.trim() || id;
  return { id, track, level, lessonNumber, title };
}

export function canonicalizeRecoveredCurriculum(content: string, sourceFilename?: string): string | null {
  const identity = detectRecoveredCanonicalIdentity(content, sourceFilename);
  if (!identity) return null;
  const today = new Date().toISOString().slice(0, 10);
  return [
    "---",
    `id: ${identity.id}`,
    `track: ${identity.track}`,
    `officialTrackName: ${TRACK_NAMES[identity.track]}`,
    `level: ${identity.level}`,
    `lessonNumber: ${identity.lessonNumber}`,
    `title: ${identity.title}`,
    "version: 1.0",
    "author: Edunancial Faculty",
    `date: ${today}`,
    "---",
    "",
    content.trim(),
    "",
  ].join("\n");
}
