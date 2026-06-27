export function saveProgress(
  packId: string,
  completed: string[]
) {
  localStorage.setItem(
    `progress-${packId}`,
    JSON.stringify(completed)
  );
}

export function loadProgress(
  packId: string
): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const value = localStorage.getItem(
    `progress-${packId}`
  );

  if (!value) {
    return [];
  }

  return JSON.parse(value);
}
