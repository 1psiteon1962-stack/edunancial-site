import AccessGate from '@/components/AccessGate'

export default function Page() {
  return (
    <AccessGate requiredLevel={3}>
      <div>Level 3 Content</div>
    </AccessGate>
  )
}
