import Image from 'next/image'
import Link from 'next/link'

const F1Banner = () => {
  return (
    <div className="group border-border relative h-80 w-full cursor-pointer overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl md:h-[26rem] lg:h-[30rem]">
      <Link
        href="/f1"
        className="focus-visible:ring-focus block h-full w-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Image
          src="/f1-Bg-Big.png"
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
            className="max-w-lg text-2xl font-bold tracking-tight text-balance drop-shadow-md transition-transform duration-300 group-hover:scale-[1.02] sm:text-3xl md:text-4xl lg:text-5xl"
            style={{ color: 'var(--highlight)' }}
          >
            შემოაბიჯე F1 სამყაროში
          </h2>
          <span className="mt-3 max-w-md text-sm font-medium text-white/90">
            სეზონი, გრიდი და ანალიტიკა
          </span>
        </div>
      </Link>
    </div>
  )
}

export default F1Banner
