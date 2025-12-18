export function calculateLevel(scores: number[]): number {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (avg < 1.8) return 1;
  if (avg < 2.6) return 2;
  if (avg < 3.4) return 3;
  if (avg < 4.2) return 4;
  return 5;
}
