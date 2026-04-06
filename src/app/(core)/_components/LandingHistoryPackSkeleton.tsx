import { Skeleton } from '@heroui/react'

const LandingHistoryPackSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-surface flex h-auto flex-col overflow-hidden rounded-xl border shadow-sm md:h-64 md:flex-row"
        >
          <Skeleton className="h-52 w-full rounded-none md:h-full md:w-2/5" />

          <div className="flex w-full flex-col gap-3 border-t p-5 md:w-3/5 md:border-t-0 md:border-l md:p-6">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="mt-4 h-4 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default LandingHistoryPackSkeleton
