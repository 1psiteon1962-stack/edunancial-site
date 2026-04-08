export type PlanCode =
  | 'free'
  | 'starter'
  | 'basic'
  | 'growth'
  | 'pro'
  | 'enterprise'
  | 'elite'

export const plans: Record<
  PlanCode,
  {
    name: string
    price: number
  }
> = {
  free: {
    name: 'Free',
    price: 0,
  },
  starter: {
    name: 'Starter',
    price: 9,
  },
  basic: {
    name: 'Basic',
    price: 19,
  },
  growth: {
    name: 'Growth',
    price: 49,
  },
  pro: {
    name: 'Pro',
    price: 99,
  },
  enterprise: {
    name: 'Enterprise',
    price: 199,
  },
  elite: {
    name: 'Elite',
    price: 499,
  },
}

export function normalizePlan(input?: string | null): PlanCode {
  const value = (input || 'free').toLowerCase().trim()

  switch (value) {
    case 'starter':
      return 'starter'
    case 'basic':
      return 'basic'
    case 'growth':
      return 'growth'
    case 'pro':
      return 'pro'
    case 'enterprise':
      return 'enterprise'
    case 'elite':
      return 'elite'
    case 'free':
    default:
      return 'free'
  }
}
