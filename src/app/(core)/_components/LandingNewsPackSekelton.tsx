import { Skeleton } from '@heroui/react'
import React from 'react'

const LandingNewsPackSekelton = () => {
  return (
    <div className="grid h-auto w-full grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-12">
      <Skeleton className="min-h-[300px] rounded-lg lg:col-span-8 lg:min-h-full" />
      <div className="flex h-full flex-col gap-4 lg:col-span-4">
        <Skeleton className="min-h-[80px] w-full flex-1 rounded-lg" />
        <Skeleton className="min-h-[80px] w-full flex-1 rounded-lg" />
        <Skeleton className="min-h-[80px] w-full flex-1 rounded-lg" />
        <Skeleton className="min-h-[80px] w-full flex-1 rounded-lg" />
        <Skeleton className="min-h-[80px] w-full flex-1 rounded-lg" />
      </div>
    </div>
  )
}

export default LandingNewsPackSekelton
