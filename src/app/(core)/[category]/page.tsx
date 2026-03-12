import { ArticlesWrapper } from '@/src/components/ArticlesWrapper'
import { ArticlesWrapperSkeleton } from '@/src/components/ArticlesWrapperSkeleton'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { category } = await params
  const sParams = await searchParams
  const currentPage = Number(sParams.page) || 1

  const suspenseKey = `${category}-${currentPage}`

  return (
    <main>
      <Suspense key={suspenseKey} fallback={<ArticlesWrapperSkeleton />}>
        <ArticlesWrapper category={category} page={currentPage} />
      </Suspense>
    </main>
  )
}

export default Page
