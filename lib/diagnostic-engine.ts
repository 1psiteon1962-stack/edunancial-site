export function scoreDiagnostic(
  answers: Record<string, number>
): number {
  return Object.values(answers).reduce((sum, val) => sum + val, 0);
}
