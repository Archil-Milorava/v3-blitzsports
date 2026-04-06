import { getNewsByCategory } from '../server/actions/articles/actions'
import { getCategoryTitle } from '../utils/category-labels'
import NewsCard from './NewsCard'
import { PaginationBasic } from './ui/PaginationBasic'
import Link from 'next/link'

export const ArticlesWrapper = async ({ category, page }: { category: string; page: number }) => {
  const { articles, totalPages } = await getNewsByCategory(category, page)
  const title = getCategoryTitle(category)

  if (articles.length === 0) {
    return (
      <main className="bg-background flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
        <div className="border-border bg-surface max-w-md rounded-2xl border px-8 py-10 text-center shadow-sm">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            ამ კატეგორიაში სტატიები ჯერ არ არის, ან გვერდი არასწორია.
          </p>
          <Link
            href="/"
            className="bg-accent text-accent-foreground mt-6 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            მთავარ გვერდზე დაბრუნება
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-background min-h-screen w-full">
      <div className="border-border/60 from-surface/90 to-background border-b bg-gradient-to-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-8">
          <p className="text-muted text-xs font-semibold tracking-wider uppercase">კატეგორია</p>
          <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="text-muted max-w-2xl text-sm leading-relaxed sm:text-base">
            უახლესი მასალები და სიახლეები — გადაფურცლეთ ქვემოთ.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-2 py-8 sm:px-4 md:px-10 lg:px-14 xl:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {articles.map((article) => (
            <NewsCard key={article.id} Article={article} />
          ))}
        </div>
        {totalPages > 1 ? (
          <div className="mt-10 flex justify-center pb-8">
            <PaginationBasic totalPages={totalPages} />
          </div>
        ) : null}
      </div>
    </main>
  )
}
