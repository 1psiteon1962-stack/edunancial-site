import AccessGate from '../../../../components/AccessGate'

export default function Page() {
  return (
    <AccessGate requiredLevel={5}>
      <div>Level 5</div>
    </AccessGate>
  )
}
