import { AccessGate } from '../../../components'

export default function Page() {
  return (
    <AccessGate requiredLevel={5}>
      <div>Level 5</div>
    </AccessGate>
  )
}
