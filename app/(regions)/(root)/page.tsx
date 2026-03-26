import { getRootPage } from '@/lib/velite'
import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function Page() {
  const page = await getRootPage()

  if (!page || !page.body || !page.body.code) {
    throw new Error(
      'Velite content missing. Ensure "velite build" runs before Next.js build.'
    )
  }

  return <MDXRemote {...page.body} />
}
