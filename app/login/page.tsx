import { plans } from '@/app/lib/plans'

export default function LoginPage() {
  return (
    <div style={{ padding: '40px' }}>
      <h1>Login</h1>

      <h2>Available Plans</h2>
      <ul>
        {plans.map((plan) => (
          <li key={plan.id}>
            {plan.name} - ${plan.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
