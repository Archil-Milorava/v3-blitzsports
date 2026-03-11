import { Separator } from '@heroui/react'
import { ChevronRight } from 'lucide-react'

import Link from 'next/link'

const CategorySeparator = ({ title, url }: { title: string; url: string }) => {
  return (
    <Link href={url} className="group mt-2 mb-6 cursor-pointer">
      <div className="my-1 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex items-center">
          <p className="group-hover:text-accent text-sm transition-all duration-300">იხილეთ მეტი</p>
          <ChevronRight
            size={20}
            className="group-hover:text-accent transition-all duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
      <Separator className="bg-accent" />
    </Link>
  )
}

export default CategorySeparator
