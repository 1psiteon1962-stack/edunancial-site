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
