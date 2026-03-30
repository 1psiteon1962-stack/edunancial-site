import AccessGate from '@/components/AccessGate'

export default function Page() {
  return (
    <AccessGate requiredLevel={1}>
      <div>Level 1 Content</div>
    </AccessGate>
  )
}
