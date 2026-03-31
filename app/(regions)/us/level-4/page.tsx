import { AccessGate } from '../../../components'

export default function Page() {
  return (
    <AccessGate requiredLevel={4}>
      <div>Level 4</div>
    </AccessGate>
  )
}
