import Link from 'next/link'
import { Article } from '../types/types'
import { getPlainTextExcerpt, publishDate } from '../utils/utils'
import { Chip } from '@heroui/react'
import Image from 'next/image'

interface NewsCardProps {
  Article: Article
}

const NewsCard = ({ Article: article }: NewsCardProps) => {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group border-border bg-surface focus-visible:ring-focus relative flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" aria-hidden />
        {article.category ? (
          <div className="absolute top-3 left-3 z-10">
            <Chip size="sm" variant="secondary" className="backdrop-blur-sm">
              {article.category}
            </Chip>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-grow flex-col p-5">
        <time className="text-muted mb-1 text-xs font-medium" dateTime={new Date(article.createdAt).toISOString()}>
          {publishDate(article.createdAt)}
        </time>

        <h2 className="text-foreground group-hover:text-accent mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight transition-colors sm:text-xl">
          {article.title}
        </h2>

        <p className="text-muted line-clamp-2 text-sm leading-relaxed">
          {getPlainTextExcerpt(article.content, 140)}
        </p>
      </div>

      <div className="bg-accent h-1 w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  )
}

export default NewsCard
