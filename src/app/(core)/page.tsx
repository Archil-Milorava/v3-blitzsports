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
    <div className="bg-background flex min-h-screen w-full flex-col px-2 py-8 sm:px-4 sm:py-10 md:px-10 lg:px-14 xl:px-40">
      <div className="flex flex-col">
        <CategorySeparator title="ახალი ამბები" url="/football" subtitle="უახლესი სიახლეები" />
        <Suspense fallback={<LandingNewsPackSekelton />}>
          <LandingNewsPack />
        </Suspense>
      </div>
      <div className="mt-12 flex flex-col sm:mt-16">
        <CategorySeparator title="ისტორიები" url="/other" subtitle="რჩეული ისტორიები" />
        <Suspense fallback={<LandingHistoryPackSkeleton />}>
          <LandingHistoryPack />
        </Suspense>
      </div>
      <section aria-label="კატეგორიები" className="mt-10 flex flex-col gap-8 sm:mt-14 sm:gap-10">
        <MmaBanner />
        <F1Banner />
      </section>
      <QASection />
    </div>
  )
}

export default page
