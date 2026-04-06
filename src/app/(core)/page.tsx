import CategorySeparator from '@/src/components/ui/CategorySeparator'
import { Suspense } from 'react'
import LandingHistoryPack from './_components/LandingHistoryPack'
import LandingNewsPack from './_components/LandingNewsPack'
import LandingNewsPackSekelton from './_components/LandingNewsPackSekelton'
import LandingHistoryPackSkeleton from './_components/LandingHistoryPackSkeleton'
import MmaBanner from './_components/MmaBanner'
import F1Banner from './_components/F1Banner'
import QASection from './_components/QASection'

const page = () => {
  return (
    <div className="flex min-h-screen w-full flex-col px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-40">
      <div className="flex flex-col">
        <CategorySeparator title="ახალი ამბები" url="/news" />
        <Suspense fallback={<LandingNewsPackSekelton />}>
          <LandingNewsPack />
        </Suspense>
      </div>
      <div className="mt-15 flex flex-col">
        <CategorySeparator title="ისტორიები" url="/hisotires" />
        <Suspense fallback={<LandingHistoryPackSkeleton />}>
          <LandingHistoryPack />
        </Suspense>
      </div>
      <MmaBanner />
      <F1Banner />
      <QASection />
    </div>
  )
}

export default page
