export type VideoR2AudioRole = "narration" | "music";

export type VideoR2AudioMix = {
  narrationVolume: number;
  musicVolume: number;
};

export const DEFAULT_VIDEO_R2_AUDIO_MIX: VideoR2AudioMix = {
  narrationVolume: 1,
  musicVolume: 0.2,
};

export function requireVideoR2AudioVolume(value: number, role: VideoR2AudioRole): number {
  if (!Number.isFinite(value) || value < 0 || value > 2) {
    throw new Error(`${role} volume must be between 0 and 2.`);
  }
  return value;
}

export function requireVideoR2NarrationLocale(locale: string): string {
  const normalized = locale.trim();
  if (!normalized) throw new Error("Narration locale is required.");
  return normalized;
}

export function requireVideoR2ImageMimeType(mimeType: string): string {
  const normalized = mimeType.trim().toLowerCase();
  if (!normalized.startsWith("image/")) throw new Error("Video scene image must use an image MIME type.");
  return normalized;
}
