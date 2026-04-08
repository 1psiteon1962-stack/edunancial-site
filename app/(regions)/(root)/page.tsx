import { getRootPage } from '@/lib/velite'

export default async function Page() {
  const page = await getRootPage()

  return (
    <main style={{ padding: '20px' }}>
      <h1>{page.title}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: page.body?.code || '<p>No content available</p>',
        }}
      />
    </main>
  )
}
