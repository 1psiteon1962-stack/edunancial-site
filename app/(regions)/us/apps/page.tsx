import AccessGate from '../../../../components/AccessGate'

export default function Page() {
  return (
    <AccessGate requiredLevel={1}>
      <div>Apps Page</div>
    </AccessGate>
  )
}
