import { plans } from '@/app/lib/plans'

export default function Page() {
  // Convert object → array safely
  const planList = Object.entries(plans).map(([code, plan]) => ({
    id: code,
    ...plan,
  }))

  return (
    <div style={{ padding: '20px' }}>
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
