// Shared curriculum preservation helpers.
// Ordinary curriculum operations must never silently remove active lessons.

export function activeLessonIds(registry) {
  const ids = new Set();
  for (const track of Object.values(registry?.tracks || {})) {
    for (const level of Object.values(track?.levels || {})) {
      for (const [assetId, asset] of Object.entries(level?.assets || {})) {
        if (asset?.type === 'lesson' && asset?.status === 'active') ids.add(assetId);
      }
    }
  }
  return ids;
}

export function assertRegistryNonDestructive(previousRegistry, nextRegistry) {
  const previous = activeLessonIds(previousRegistry);
  const next = activeLessonIds(nextRegistry);
  const missing = [...previous].filter((id) => !next.has(id)).sort();

  if (missing.length > 0) {
    const preview = missing.slice(0, 20).join(', ');
    const suffix = missing.length > 20 ? ` (+${missing.length - 20} more)` : '';
    throw new Error(
      `Refusing destructive curriculum registry write: ${missing.length} active lesson(s) would disappear: ${preview}${suffix}. ` +
      'Ordinary imports and registry regeneration may only preserve or increase the active lesson set. Use the separately authorized removal workflow for intentional deletion.',
    );
  }
}
