import { notFound } from 'next/navigation'

type PageProps = {
  params: {
    region: string
  }
}

/**
 * Define regions as simple strings (matches your current data)
 */
const regions = ['us', 'eu', 'mena', 'apac']

export default function RegionPage({ params }: PageProps) {
  const region = regions.find((r) => r === params.region)

  if (!region) {
    notFound()
  }

  return (
    <main style={{ padding: '20px' }}>
      <h1>Region: {region}</h1>
      <p>Welcome to the {region.toUpperCase()} region.</p>
    </main>
  )
}
