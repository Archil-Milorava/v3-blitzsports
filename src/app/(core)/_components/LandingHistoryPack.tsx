import { getLandingHistories } from '@/src/server/actions/articles/actions'
import HistoryCard from './HistoryCard'

const LandingHistoryPack = async () => {
  const landingHistories = await getLandingHistories()
  if (!landingHistories?.length) return null
  return (
    <div className=" flex flex-col gap-4">
      {landingHistories.map((item) => (
        <HistoryCard key={item.id} history={item} />
      ))}
    </div>
  )
}

export default LandingHistoryPack
