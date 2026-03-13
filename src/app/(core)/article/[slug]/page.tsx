import { getArticle } from '@/src/server/actions/articles/actions'
import Image from 'next/image'
import './article-styles.css'
import SocMediaShare from '@/src/components/SocMediaShare'
import MmaBanner from '../../_components/MmaBanner'

interface pageProps {
  params: Promise<{ slug: string }>
}

const page = async ({ params }: pageProps) => {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const article = await getArticle(decodedSlug)
  const shareUrl = `https://www.blitzsports.live/article/${decodedSlug}`
  const shareText = encodeURIComponent(article.title)
  const publishDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  console.log(article)

  return (
    <main className="flex min-h-screen w-full flex-col px-8 py-10 sm:px-12 md:px-20 lg:px-32 xl:px-72">
      <div className="relative h-[20rem] w-full overflow-hidden rounded-lg bg-red-300 shadow transition-all duration-500 sm:h-[22rem] md:h-[26rem] lg:h-[32rem] xl:h-[38rem]">
        <Image
          src={article.coverImage}
          alt={article.title}
          className="absolute object-cover"
          fill
        />
      </div>
      <h1 className="my-4 text-lg font-bold tracking-wide sm:text-xl md:text-2xl lg:text-3xl xl:text-3xl">
        {article.title}
      </h1>{' '}
      <article>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
      <SocMediaShare shareText={shareText} shareUrl={shareUrl} />
      <div className="border-accent mt-11 flex items-center space-x-4 border-t border-b p-2">
        <div className="flex items-center">
          <div className="relative mr-3 h-10 w-10 overflow-hidden rounded-full">
            <Image src={article.author.image || ''} alt={article.author.displayName || ''} fill />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{article.author?.displayName || ''}</p>
            <p className="text-xs text-gray-500">{publishDate}</p>
          </div>
        </div>
      </div>
      <MmaBanner />
    </main>
  )
}

export default page
