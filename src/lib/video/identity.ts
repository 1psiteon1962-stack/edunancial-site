import { normalizeLanguageCode } from "@/lib/international/languages";

export const VIDEO_TRACKS = ["RED","WHITE","BLUE","GREEN","GOLD","PURPLE","ORANGE","BLACK"] as const;
export type VideoTrack = (typeof VIDEO_TRACKS)[number];
export type VideoPurpose = "marketing" | "lesson";
export type VideoOutputProfile = "vertical_1080x1920" | "landscape_1920x1080" | "square_1080x1080";

export function normalizeVideoLocale(input: string | undefined | null): string {
  return normalizeLanguageCode(input);
}

export function normalizeVideoTrack(input: string | undefined | null): VideoTrack | null {
  const value = input?.trim().toUpperCase() ?? "";
  return VIDEO_TRACKS.includes(value as VideoTrack) ? value as VideoTrack : null;
}

export function makeVideoLessonId(track: string, level: number, lessonNumber: number): string {
  const normalizedTrack = normalizeVideoTrack(track);
  if (!normalizedTrack) throw new Error("Invalid curriculum track.");
  if (!Number.isInteger(level) || level < 1 || level > 5) throw new Error("Video lesson level must be between 1 and 5.");
  if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 999) throw new Error("Invalid lesson number.");
  return `${normalizedTrack}-L${level}-${String(lessonNumber).padStart(3, "0")}`;
}

export function parseVideoLessonId(input: string): { track: VideoTrack; level: number; lessonNumber: number } | null {
  const match = /^([A-Z]+)-L([1-5])-(\d{3})$/u.exec(input.trim().toUpperCase());
  if (!match) return null;
  const track = normalizeVideoTrack(match[1]);
  const level = Number(match[2]);
  const lessonNumber = Number(match[3]);
  if (!track || lessonNumber < 1) return null;
  return { track, level, lessonNumber };
}
