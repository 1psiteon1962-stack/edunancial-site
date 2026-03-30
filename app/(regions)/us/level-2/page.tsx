import AccessGate from '@/components/AccessGate'

export default function Page() {
  return (
    <AccessGate requiredLevel={2}>
      <div>Level 2 Content</div>
    </AccessGate>
  )
}
