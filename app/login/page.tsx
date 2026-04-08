import { plans } from '@/app/lib/plans'

type PlanItem = {
  id: string
  name: string
  price?: number
}

export default function Page() {
  const planList: PlanItem[] = Object.entries(plans).map(
    ([code, plan]: [string, any]) => ({
      id: code,
      name: plan.name,
      price: plan.price,
    })
  )

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>

      <h2>Available Plans</h2>
      <ul>
        {planList.map((plan) => (
          <li key={plan.id}>
            {plan.name} - ${plan.price ?? 0}
          </li>
        ))}
      </ul>
    </div>
  )
}
