import { AccessGate } from '../../../components'

export default function Page() {
  return (
    <AccessGate requiredLevel={1}>
      <div>Level 1</div>
    </AccessGate>
  )
}
