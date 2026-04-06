import { Skeleton } from '@heroui/react'
import React from 'react'

const LandingNewsPackSekelton = () => {
  return (
    <div className="grid h-auto w-full grid-cols-1 gap-4 lg:h-[min(600px,85vh)] lg:grid-cols-12 lg:gap-5">
      <Skeleton className="min-h-[280px] rounded-xl lg:col-span-8 lg:min-h-full" />
      <div className="flex h-full flex-col gap-3 lg:col-span-4">
        <Skeleton className="min-h-[88px] w-full flex-1 rounded-xl" />
        <Skeleton className="min-h-[88px] w-full flex-1 rounded-xl" />
        <Skeleton className="min-h-[88px] w-full flex-1 rounded-xl" />
        <Skeleton className="min-h-[88px] w-full flex-1 rounded-xl" />
        <Skeleton className="min-h-[88px] w-full flex-1 rounded-xl" />
      </div>
    </div>
  )
}

export default LandingNewsPackSekelton
