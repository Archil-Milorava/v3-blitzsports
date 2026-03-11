import { Article } from '@/src/types/types'
import getPlainTextExcerpt from '@/src/utils/utils'
import Image from 'next/image'
import Link from 'next/link'

interface NewsCardProps {
  history: Article
}

const HistoryCard = ({ history }: NewsCardProps) => {
  const formattedDate = new Date(history.updatedAt).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <Link
      href={`/article/${history.slug}`}
      className="group relative flex h-auto cursor-pointer flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md md:h-64 md:flex-row"
    >
      {/* Hover border animation */}
      <div className="bg-accent absolute top-0 right-0 h-full w-0 transition-all duration-300 group-hover:w-1" />

      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] md:h-full md:w-2/5">
        <Image
          src={history.coverImage}
          alt={history.title}
          fill
          className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-100"
        />
        <span className="bg-accent text-accent-foreground absolute top-2 left-2 z-10 rounded px-2 py-1 text-xs font-semibold tracking-wider capitalize">
          {history.category?.toUpperCase()}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex w-full flex-col p-5 transition-transform duration-300 group-hover:translate-x-1 md:w-3/5 md:p-6">
        <div className="flex-grow">
          <h2 className="group-hover:text-secondary mb-3 line-clamp-2 text-xl font-bold text-gray-900 transition-colors duration-200">
            {history.title}
          </h2>
          <p className="mb-4 line-clamp-3 text-sm text-gray-600 transition-colors duration-200 group-hover:text-gray-800 md:text-base">
            {getPlainTextExcerpt(history.content)}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="text-xs font-medium text-gray-500 transition-colors duration-200 group-hover:text-gray-700">
            {formattedDate}
          </div>
          <span className="group-hover:text-secondary text-sm font-medium text-black transition-all duration-300">
            სრულად →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default HistoryCard
