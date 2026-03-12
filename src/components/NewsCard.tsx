import Link from 'next/link'
import { Article } from '../types/types'
import Image from 'next/image'

interface NewsCardProps {
  Article: Article
}

const NewsCard = ({ Article }: NewsCardProps) => {
  const formattedDate = new Date(Article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  const getPlainTextExcerpt = (html: string, length: number = 100) => {
    const plainText = html.replace(/<[^>]*>?/gm, '')
    return plainText.length > length ? plainText.substring(0, length) + '...' : plainText
  }
  return (
    <Link
      href={`article/${Article.id}`}
      className="group relative flex h-full transform cursor-pointer flex-col overflow-hidden rounded-sm bg-[#FFFCF1] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-sm"
    >
      {/* Image with gradient overlay */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={Article.coverImage}
          alt={Article.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          priority
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* Floating category chip */}
        <div className="absolute top-4 left-4">
          <span className="bg-secondary inline-flex items-center rounded-full px-3 py-1.5 text-xs tracking-wider text-white backdrop-blur-sm">
            {Article.category?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-grow flex-col p-5">
        {/* Date above title */}
        <span className="mb-1.5 text-xs font-medium text-gray-500">{formattedDate}</span>

        <h2 className="mb-2.5 line-clamp-2 text-xl leading-tight font-bold text-gray-900">
          {Article.title}
        </h2>

        {/* Content excerpt with fade effect */}
        <div className="relative mb-4">
          <p className="line-clamp-2 text-sm text-gray-600">
            {getPlainTextExcerpt(Article.content)}
          </p>
        </div>
      </div>

      {/* Hover state indicator */}
      <div className="bg-secondary absolute inset-x-0 bottom-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Link>
  )
}

export default NewsCard
