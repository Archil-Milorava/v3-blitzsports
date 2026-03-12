// src/components/ArticlesWrapper.tsx
import { getNewsByCategory } from '../server/actions/articles/actions'
import NewsCard from './NewsCard'
import { PaginationBasic } from './ui/PaginationBasic'

export const ArticlesWrapper = async ({ category, page }: { category: string; page: number }) => {
  const { articles, totalPages } = await getNewsByCategory(category, page)

  if (articles.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-5xl font-bold tracking-wider">
        სტატიები ვერ მოიძებნა
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-8">
      <h1 className="text-4xl font-semibold">{category}</h1>
      <div className="grid grid-cols-1 gap-6 px-2 py-10 sm:px-4 md:grid-cols-2 md:px-10 lg:px-14 xl:px-40">
        {articles.map((article) => (
          <NewsCard key={article.id} Article={article} />
        ))}
      </div>
      {totalPages > 1 && <PaginationBasic totalPages={totalPages} />}
    </div>
  )
}
