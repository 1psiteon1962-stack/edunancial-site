export const VIDEO_R2_MIN_DURATION_SECONDS = 15;
export const VIDEO_R2_MAX_DURATION_SECONDS = 60;

export type VideoR2SceneTiming = { durationSeconds: number; transitionSeconds?: number | null };

export function videoR2CompositionDurationSeconds(scenes: readonly VideoR2SceneTiming[]): number {
  if (!scenes.length) return 0;
  return scenes.reduce((total, scene, index) => {
    const duration = Number(scene.durationSeconds);
    if (!Number.isFinite(duration) || duration <= 0) throw new Error("Each video scene must have a positive duration.");
    if (index === 0) return duration;
    const transition = Number(scene.transitionSeconds ?? 0);
    if (!Number.isFinite(transition) || transition < 0) throw new Error("Video transition duration cannot be negative.");
    if (transition >= duration) throw new Error("Video transition duration must be shorter than its scene.");
    return total + duration - transition;
  }, 0);
}
export function requireVideoR2CompositionDuration(scenes: readonly VideoR2SceneTiming[]): number {
  const duration = videoR2CompositionDurationSeconds(scenes);
  if (duration < 15 || duration > 60) throw new Error("Video duration must be between 15 and 60 seconds.");
  return duration;
}
