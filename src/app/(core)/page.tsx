import { Suspense } from 'react'
import LandingNewsPack from './_components/LandingNewsPack'
import LandingNewsPackSekelton from './_components/LandingNewsPackSekelton'

const page = () => {
  return (
    <div className="flex min-h-screen w-full flex-col gap-10 px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-20">
      <Suspense fallback={<LandingNewsPackSekelton />}>
        <LandingNewsPack />
      </Suspense>
    </div>
  )
}

export default page
