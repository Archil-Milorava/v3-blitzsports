import { getArticle } from '@/src/server/actions/articles/actions'
import EditArticlePage from './EditArticle'
import { notFound } from 'next/navigation'

interface pageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: pageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const article = await getArticle(decodedSlug) 

  if (!article) return notFound()

  return <EditArticlePage slug={decodedSlug} initialData={article} />
}

