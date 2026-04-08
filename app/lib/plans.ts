export type PlanCode =
  | 'free'
  | 'level-1'
  | 'level-2'
  | 'level-3'
  | 'level-4'
  | 'level-5'
  | 'enterprise'
  | 'elite'

/**
 * Full plans definition used by login + gating
 */
export const plans: Record<PlanCode, { name: string }> = {
  free: { name: 'Free' },
  'level-1': { name: 'Level 1' },
  'level-2': { name: 'Level 2' },
  'level-3': { name: 'Level 3' },
  'level-4': { name: 'Level 4' },
  'level-5': { name: 'Level 5' },
  enterprise: { name: 'Enterprise' },
  elite: { name: 'Elite' }
}

/**
 * Normalize incoming values into a valid PlanCode
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

    case 'enterprise':
      return 'enterprise'

    case 'elite':
      return 'elite'

    default:
      return 'free'
  }
}
