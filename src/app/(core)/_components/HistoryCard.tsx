import { Article } from '@/src/types/types'
import { getPlainTextExcerpt, publishDate } from '@/src/utils/utils'
import { Chip } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

interface HistoryCardProps {
  history: Article
}

const HistoryCard = ({ history }: HistoryCardProps) => {
  return (
    <Link
      href={`/article/${history.slug}`}
      className="group border-border bg-surface focus-visible:ring-focus relative flex h-auto cursor-pointer flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:h-64 md:flex-row outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="border-border relative h-52 w-full shrink-0 overflow-hidden border-b md:h-full md:w-2/5 md:border-r md:border-b-0">
        <Image
          src={history.coverImage}
          alt={history.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
          {history.category ? (
            <Chip size="sm" color="success" variant="secondary" className="backdrop-blur-sm">
              {history.category}
            </Chip>
          ) : null}
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-col p-5 md:w-3/5 md:p-6">
        <div className="min-h-0 flex-1">
          <h2 className="text-foreground group-hover:text-accent mb-2 line-clamp-2 text-xl font-bold leading-snug tracking-tight transition-colors md:text-2xl">
            {history.title}
          </h2>
          <p className="text-muted group-hover:text-foreground/90 line-clamp-3 text-sm leading-relaxed transition-colors md:text-base">
            {getPlainTextExcerpt(history.content, 220)}
          </p>
        </div>

        <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
          <time className="text-muted text-xs font-medium" dateTime={new Date(history.updatedAt).toISOString()}>
            {publishDate(history.updatedAt)}
          </time>
          <span className="text-accent text-sm font-semibold transition-transform group-hover:translate-x-0.5">
            სრულად →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default HistoryCard
