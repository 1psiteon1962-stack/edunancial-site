export type Plan = {
  id: string
  name: string
  price: number
  features: string[]
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic access']
  },
  {
    id: 'level-1',
    name: 'Level 1',
    price: 9.99,
    features: ['Access to Level 1 content']
  },
  {
    id: 'level-2',
    name: 'Level 2',
    price: 19.99,
    features: ['Access to Level 1 + Level 2']
  },
  {
    id: 'level-3',
    name: 'Level 3',
    price: 29.99,
    features: ['Full access']
  }
]

export function getPlan(id: string) {
  return plans.find((p) => p.id === id)
}
