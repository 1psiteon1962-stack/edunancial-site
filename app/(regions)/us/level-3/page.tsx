import { AccessGate } from '@/components'

export default function Page() {
  return (
    <AccessGate requiredLevel={3}>
      <div>Level 3</div>
    </AccessGate>
  )
}
