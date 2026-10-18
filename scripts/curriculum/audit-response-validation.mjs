/**
 * Validate each read-only production audit response before accepting it into the
 * pass/fail report. HTTP 200 alone cannot establish curriculum availability.
 * Kept dependency-free so CI can test the contract without production access.
 */
export function validateCoordinateResponse(response, job) {
  if (!response || !Array.isArray(response.coordinates) || response.coordinates.length !== 1) {
    throw new Error('Invalid audit response: expected exactly one coordinate.');
  }
  const coordinate = response.coordinates[0];
  if (!coordinate || coordinate.track !== job.track || coordinate.level !== job.level || coordinate.locale !== job.locale) {
    throw new Error('Invalid audit response: coordinate does not match request.');
  }
  if (coordinate.expectedLessonCount !== 50 ||
      !Number.isInteger(coordinate.retrievableLessonCount) ||
      coordinate.retrievableLessonCount < 0 || coordinate.retrievableLessonCount > 50 ||
      !Number.isInteger(coordinate.discoveredLessonCount) ||
      coordinate.discoveredLessonCount < 0 || coordinate.discoveredLessonCount > 50 ||
      !Number.isInteger(coordinate.englishFallbackLessonCount) ||
      coordinate.englishFallbackLessonCount < 0 || coordinate.englishFallbackLessonCount > 50 ||
      !Array.isArray(coordinate.missingLessonIDs) || !Array.isArray(coordinate.englishFallbackLessonIDs) ||
      !['PASS', 'FAIL'].includes(coordinate.runtimeStatus)) {
    throw new Error('Invalid audit response: missing or inconsistent counts/status.');
  }
  // A response is not trustworthy merely because it marks the coordinate FAIL:
  // loss diagnostics must still account for all 50 canonical lesson IDs.
  const unavailableIds = [...coordinate.missingLessonIDs, ...coordinate.englishFallbackLessonIDs];
  const canonicalPrefix = `${job.track}-L${job.level}-`;
  const validId = (id) => {
    if (typeof id !== 'string' || !id.startsWith(canonicalPrefix)) return false;
    const suffix = id.slice(canonicalPrefix.length);
    return /^[0-9]{3}$/.test(suffix) && Number(suffix) >= 1 && Number(suffix) <= 50;
  };
  const failureIds = Array.isArray(coordinate.failures) ? coordinate.failures.map((failure) => failure?.lessonId) : null;
  if (!unavailableIds.every(validId) ||
      new Set(unavailableIds).size !== unavailableIds.length ||
      coordinate.englishFallbackLessonCount !== coordinate.englishFallbackLessonIDs.length ||
      coordinate.retrievableLessonCount + unavailableIds.length !== 50 ||
      coordinate.discoveredLessonCount < coordinate.retrievableLessonCount + coordinate.englishFallbackLessonCount ||
      !failureIds || failureIds.length !== unavailableIds.length ||
      new Set(failureIds).size !== failureIds.length ||
      failureIds.some((id) => !unavailableIds.includes(id))) {
    throw new Error('Invalid audit response: missing/fallback IDs contradict lesson counts or failure diagnostics.');
  }
  // The server sets first/lastLessonRetrievable from the same passing set, so the
  // flags must agree with the loss evidence in FAIL responses too.
  const unavailableSet = new Set(unavailableIds);
  const firstPasses = !unavailableSet.has(`${canonicalPrefix}001`);
  const lastPasses = !unavailableSet.has(`${canonicalPrefix}050`);
  if (coordinate.firstLessonRetrievable !== firstPasses || coordinate.lastLessonRetrievable !== lastPasses) {
    throw new Error('Invalid audit response: first/last lesson flags contradict loss diagnostics.');
  }
  // A 50/50 status without the corresponding per-source receipt counts cannot
  // prove the learner resolver actually returned 50 bodies.  The production
  // auditor increments source once for every passing lesson.
  const sourceCounts = coordinate.source;
  if (!sourceCounts || typeof sourceCounts !== 'object' || Array.isArray(sourceCounts) ||
      Object.entries(sourceCounts).some(([name, count]) => !name.trim() ||
        !Number.isInteger(count) || count < 0 || count > 50) ||
      Object.values(sourceCounts).reduce((total, count) => total + count, 0) !== coordinate.retrievableLessonCount) {
    throw new Error('Invalid audit response: source counts contradict retrievable lesson evidence.');
  }
  // Each failure emitted by the production auditor carries a concrete layer
  // diagnostic.  A bare lesson ID is not a root-cause report.
  const booleanLayers = ['gitCanonical', 'gitLocaleFile', 'atomicObject',
    'atomicObjectHasLocale', 'atomicIndexed', 'translationPackage', 'discovered', 'retrieved'];
  for (const failure of coordinate.failures) {
    const layers = failure.layers;
    if (typeof failure.disappearsAt !== 'string' || !failure.disappearsAt.trim() ||
        !layers || typeof layers !== 'object' || Array.isArray(layers) ||
        booleanLayers.some((name) => typeof layers[name] !== 'boolean') ||
        !['servedLocale', 'servedSource'].every((name) => layers[name] === null || typeof layers[name] === 'string')) {
      throw new Error('Invalid audit response: incomplete layer-by-layer failure evidence.');
    }
  }
  const complete = coordinate.retrievableLessonCount === 50 &&
    coordinate.discoveredLessonCount === 50 &&
    coordinate.englishFallbackLessonCount === 0 &&
    coordinate.missingLessonIDs.length === 0 &&
    coordinate.englishFallbackLessonIDs.length === 0 &&
    coordinate.firstLessonRetrievable === true && coordinate.lastLessonRetrievable === true;
  if ((coordinate.runtimeStatus === 'PASS') !== complete) {
    throw new Error('Invalid audit response: PASS/FAIL contradicts lesson evidence.');
  }
  return coordinate;
}
