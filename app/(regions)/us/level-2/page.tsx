import { AccessGate } from '../../../components'

export default function Page() {
  return (
    <AccessGate requiredLevel={2}>
      <div>Level 2</div>
    </AccessGate>
  )
}
