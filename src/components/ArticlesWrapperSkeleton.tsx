import { Skeleton } from '@heroui/react'

export const ArticlesWrapperSkeleton = () => {
  // We create an array of 6 items to represent the grid loading
  const skeletonCards = Array.from({ length: 6 })

  return (
    <div className="flex flex-col items-center justify-center gap-1 py-8">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-40 rounded-lg" />

      <div className="grid w-full grid-cols-1 gap-6 px-2 py-10 sm:px-4 md:grid-cols-2 md:px-10 lg:px-14 xl:px-40">
        {skeletonCards.map((_, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border p-4">
            {/* Image Placeholder */}
            <Skeleton className="h-48 w-full rounded-xl" />
            {/* Title Placeholder */}
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            {/* Content Placeholder */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-5/6 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
