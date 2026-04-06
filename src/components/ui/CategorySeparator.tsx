import { Separator } from '@heroui/react'
import { ChevronRight } from 'lucide-react'

import Link from 'next/link'

type CategorySeparatorProps = {
  title: string
  url: string
  subtitle?: string
}

const CategorySeparator = ({ title, url, subtitle }: CategorySeparatorProps) => {
  return (
    <Link
      href={url}
      className="group focus-visible:ring-focus mb-6 mt-2 block cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
          {subtitle ? <p className="text-muted mt-1 text-sm">{subtitle}</p> : null}
        </div>
        <div className="text-muted group-hover:text-accent mt-2 flex shrink-0 items-center gap-0.5 text-sm font-medium transition-colors sm:mt-0">
          <span>იხილეთ მეტი</span>
          <ChevronRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </div>
      <Separator className="bg-accent mt-4 h-px" />
    </Link>
  )
}

export default CategorySeparator
