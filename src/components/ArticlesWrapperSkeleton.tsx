import { Skeleton } from '@heroui/react'

export const ArticlesWrapperSkeleton = () => {
  const skeletonCards = Array.from({ length: 6 })

  return (
    <main className="bg-background min-h-screen w-full">
      <div className="border-border/60 from-surface/90 to-background border-b bg-gradient-to-b">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-8">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-10 w-56 max-w-full rounded-lg sm:h-12 sm:w-72" />
          <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-2 py-8 sm:px-4 md:px-10 lg:px-14 xl:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="border-border bg-surface flex flex-col overflow-hidden rounded-xl border shadow-sm"
            >
              <div className="relative aspect-[16/10] w-full">
                <Skeleton className="absolute inset-0 size-full rounded-none rounded-t-xl" />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <Skeleton className="h-3 w-28 rounded-md" />
                <Skeleton className="h-6 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
