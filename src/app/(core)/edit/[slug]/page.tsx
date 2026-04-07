import { getArticle } from '@/src/server/actions/articles/actions'
import EditArticlePage from './EditArticle'

export default async function Page({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)

  return <EditArticlePage initialData={article} />
}