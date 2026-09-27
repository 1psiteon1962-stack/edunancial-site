import { createHash } from "node:crypto";
import { requireVideoR2CompositionDuration } from "./duration";

export type VideoR2FrozenScene = {
  assetId: string;
  storageKey: string;
  mimeType: string;
  durationSeconds: number;
  fit: "contain" | "cover";
  overlayText?: Record<string, string> | null;
  transition?: { type: "cut" | "fade"; seconds: number } | null;
};

export type VideoR2FrozenAudio = {
  assetId: string;
  storageKey: string;
  role: "narration" | "music";
  locale?: string | null;
  volume: number;
};

export type VideoR2FrozenComposition = {
  version: 1;
  locale: string;
  outputProfile: "vertical" | "landscape" | "square";
  scenes: VideoR2FrozenScene[];
  audio: VideoR2FrozenAudio[];
};

export function requireVideoR2FrozenComposition(value: VideoR2FrozenComposition): VideoR2FrozenComposition {
  if (value.version !== 1) throw new Error("Unsupported Video R2 composition version.");
  if (!value.locale.trim()) throw new Error("Video locale is required.");
  if (!value.scenes.length) throw new Error("Video requires at least one scene.");
  for (const scene of value.scenes) {
    if (!scene.assetId || !scene.storageKey || !scene.mimeType) throw new Error("Every video scene requires a ready immutable asset.");
  }
  requireVideoR2CompositionDuration(value.scenes.map((scene) => ({
    durationSeconds: scene.durationSeconds,
    transitionSeconds: scene.transition?.seconds ?? 0,
  })));
  return value;
}

export function videoR2CompositionHash(value: VideoR2FrozenComposition): string {
  const validated = requireVideoR2FrozenComposition(value);
  return createHash("sha256").update(JSON.stringify(validated)).digest("hex");
}
