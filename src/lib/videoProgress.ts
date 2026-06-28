export interface VideoProgress {
  userId: string;
  lessonId: string;
  secondsWatched: number;
  completed: boolean;
  updatedAt: string;
}

const KEY = "edunancial-video-progress";

export function saveVideoProgress(progress: VideoProgress) {
  if (typeof window === "undefined") return;

  const items = getVideoProgress();

  const filtered = items.filter(
    item =>
      !(
        item.userId === progress.userId &&
        item.lessonId === progress.lessonId
      )
  );

  localStorage.setItem(
    KEY,
    JSON.stringify([...filtered, progress])
  );
}

export function getVideoProgress(): VideoProgress[] {
  if (typeof window === "undefined") return [];

  const value = localStorage.getItem(KEY);

  return value ? JSON.parse(value) : [];
}
