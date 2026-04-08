import { getRegion } from '../../../lib/regions'
import { isLanguage } from '../../../lib/i18n/languages'
import { getDictionary } from '../../../lib/i18n/getDictionary'
import { notFound } from 'next/navigation'

type PageProps = {
  params: {
    region: string
    lang: string
  }
}

export default async function Page({ params }: PageProps) {
  const region = getRegion(params.region)

  if (!region) {
    notFound()
  }

  if (!isLanguage(params.lang)) {
    notFound()
  }

  const dict = await getDictionary(params.lang)

  return (
    <main style={{ padding: '40px' }}>
      <h1>{dict?.title || 'Edunancial'}</h1>
      <p>Region: {params.region}</p>
      <p>Language: {params.lang}</p>
    </main>
  )
}
