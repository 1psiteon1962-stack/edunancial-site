export type PlanCode =
  | 'free'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'level-5'

/**
 * Normalizes any incoming plan string into a valid PlanCode
 */
export function normalizePlan(input?: string | null): PlanCode {
  if (!input) return 'free'

  const value = input.toLowerCase().trim()

  switch (value) {
    case 'level-1':
    case 'level1':
    case '1':
      return 'level-1'

    case 'level-2':
    case 'level2':
    case '2':
      return 'level-2'

    case 'level-3':
    case 'level3':
    case '3':
      return 'level-3'

    case 'level-4':
    case 'level4':
    case '4':
      return 'level-4'

    case 'level-5':
    case 'level5':
    case '5':
      return 'level-5'

    case 'free':
    default:
      return 'free'
  }
}
