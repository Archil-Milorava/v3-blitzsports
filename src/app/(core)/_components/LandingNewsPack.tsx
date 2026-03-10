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
    <div className="grid h-auto w-full grid-cols-1 gap-4 lg:h-[600px] lg:grid-cols-12">
      {/* Latest news */}
      <Link
        href={`/article/${latestNews.slug}`}
        className="group relative min-h-[300px] overflow-hidden rounded-lg lg:col-span-8 lg:min-h-full"
      >
        <Image
          src={latestNews.coverImage}
          alt={latestNews.title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/10" />

        <Chip className="absolute top-4 left-4 z-10">{latestNews.category}</Chip>

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <h2 className="text-xl font-semibold text-white group-hover:underline lg:text-3xl">
            {latestNews.title}
          </h2>
        </div>
      </Link>

      {/* Other news */}
      <div className="flex h-full flex-col gap-4 lg:col-span-4">
        {restNews.map((news) => (
          <Link
            key={news.id}
            href={`/article/${news.slug}`}
            className="group flex min-h-[80px] w-full flex-1 overflow-hidden rounded-lg bg-neutral-100"
          >
            {/* Image */}
            <div className="relative h-full w-2/6 overflow-hidden">
              <Image
                src={news.coverImage}
                alt={news.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title */}
            <div className="relative flex w-4/6 items-center p-3">
              <p className="line-clamp-2 text-lg font-medium group-hover:underline">{news.title}</p>

              <p
                className="text-accent absolute top-2 right-2 z-10 flex items-center text-xs font-semibold"
              >
                {news.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LandingNewsPack
