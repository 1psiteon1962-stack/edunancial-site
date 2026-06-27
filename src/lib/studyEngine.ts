import { FinancialTerm } from "./termTypes";

export function nextCard(
  cards: FinancialTerm[],
  index: number
) {
  if (cards.length === 0) return 0;

  if (index + 1 >= cards.length) {
    return 0;
  }

  return index + 1;
}

export function completionPercent(
  completed: number,
  total: number
) {
  if (total === 0) return 0;

  return Math.round((completed / total) * 100);
}

export function isFinished(
  completed: number,
  total: number
) {
  return completed >= total;
}
