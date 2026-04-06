import Image from 'next/image'
import Link from 'next/link'

const MmaBanner = () => {
  return (
    <div className="group border-border relative h-72 w-full cursor-pointer overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl md:h-[22rem] lg:h-[26rem]">
      <Link
        href="/mma"
        className="focus-visible:ring-focus block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Image
          src="/MMa-Bg-Big.png"
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          quality={90}
          sizes="100vw"
        />
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/55 via-black/20 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span
            className="mb-1 text-xs font-semibold tracking-[0.2em] text-white/90 uppercase"
            style={{ color: 'var(--highlight)' }}
          >
            კატეგორია
          </span>
          <h2
            className="text-5xl font-black tracking-tight text-balance drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.02] sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: 'var(--highlight)' }}
          >
            MMA
          </h2>
          <span className="mt-3 max-w-sm text-sm font-medium text-white/90">
            ყველა სიახლე და ანალიტიკა ერთ ადგილას
          </span>
        </div>
      </Link>
    </div>
  )
}

export default MmaBanner
