import { getLandingNews } from '@/src/server/actions/articles/actions'

const LandingNewsPack = async () => {
  const landingNews = await getLandingNews()

  console.log(landingNews)

  return (
    <div className="grid h-auto w-full grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-12">
      <div className="min-h-[300px] rounded-lg bg-green-300 lg:col-span-8 lg:min-h-full">asd</div>
      <div className="flex h-full flex-col gap-4 lg:col-span-4">
        <div className="min-h-[80px] w-full flex-1 rounded-lg bg-amber-200">1</div>
        <div className="min-h-[80px] w-full flex-1 rounded-lg bg-amber-400">2</div>
        <div className="min-h-[80px] w-full flex-1 rounded-lg bg-amber-500">3</div>
        <div className="min-h-[80px] w-full flex-1 rounded-lg bg-amber-600">4</div>
        <div className="min-h-[80px] w-full flex-1 rounded-lg bg-amber-800">5</div>
      </div>
    </div>
  )
}

export default LandingNewsPack
