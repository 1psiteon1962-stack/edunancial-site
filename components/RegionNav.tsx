import Link from 'next/link'

type Region = {
  code: string
  name: string
}

const regions: Region[] = [
  { code: 'us', name: 'United States' },
  { code: 'latam', name: 'Latin America' },
  { code: 'eu', name: 'Europe' },
  { code: 'africa', name: 'Africa' },
  { code: 'mena', name: 'Middle East & North Africa' },
  { code: 'asia', name: 'Asia' },
]

export default function RegionNav() {
  return (
    <nav>
      <ul style={{ display: 'flex', gap: '12px', listStyle: 'none', padding: 0 }}>
        {regions.map((region) => (
          <li key={region.code}>
            <Link href={`/${region.code}`}>
              {region.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
