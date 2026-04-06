import { getLandingNews } from '@/src/server/actions/articles/actions'
import { Chip } from '@heroui/react'
import Image from 'next/image'
import Link from 'next/link'

const LandingNewsPack = async () => {
  const landingNews = await getLandingNews()

  if (!landingNews?.length) return null

  const latestNews = landingNews[0]
  const restNews = landingNews.slice(1, 6)

  return (
    <div className="grid h-auto w-full grid-cols-1 gap-4 lg:h-[min(600px,85vh)] lg:grid-cols-12 lg:gap-5">
      <Link
        href={`/article/${latestNews.slug}`}
        className="group border-border focus-visible:ring-focus relative min-h-[280px] overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md lg:col-span-8 lg:min-h-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Image
          src={latestNews.coverImage}
          alt={latestNews.title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" aria-hidden />
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          {latestNews.category ? (
            <Chip size="sm" variant="secondary" className="backdrop-blur-sm">
              {latestNews.category}
            </Chip>
          ) : null}
          <Chip size="sm" color="warning" variant="secondary" className="backdrop-blur-sm">
            {latestNews.badge}
          </Chip>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 lg:p-8">
          <h3 className="text-balance text-xl font-semibold leading-snug text-white drop-shadow-sm transition-colors group-hover:text-white/95 sm:text-2xl lg:text-3xl">
            {latestNews.title}
          </h3>
        </div>
      </Link>

      <div className="flex min-h-0 flex-col gap-3 lg:col-span-4 lg:gap-3">
        {restNews.map((news) => (
          <Link
            key={news.id}
            href={`/article/${news.slug}`}
            className="group border-border bg-surface hover:border-accent/30 focus-visible:ring-focus flex min-h-[88px] w-full flex-1 overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="border-border relative h-auto min-h-[88px] w-[38%] max-w-[140px] shrink-0 overflow-hidden border-r sm:w-2/6">
              <Image
                src={news.coverImage}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="140px"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-3 sm:p-3.5">
              <p className="text-foreground line-clamp-2 text-sm font-medium leading-snug sm:text-base">
                {news.title}
              </p>
              {news.category ? (
                <span className="text-muted text-xs font-medium uppercase tracking-wide">
                  {news.category}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LandingNewsPack
