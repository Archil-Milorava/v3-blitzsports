import { Link, Surface } from '@heroui/react'

const footerPages = [
  {
    label: 'წესები და პირობები',
    url: '/terms-and-conditions',
  },
  {
    label: 'კონფიდენციალურობის პოლიტიკა',
    url: '/privacy-policy',
  },
  {
    label: 'ჩვენ შესახებ',
    url: '/about-us',
  },
  {
    label: 'კონტაქტი',
    url: '/contact',
  },
]

const FooterSecondary = () => {
  return (
    <Surface variant="tertiary" className="flex min-h-20 flex-col gap-4 py-2">
      <div className="flex h-1/2 w-full flex-col items-center justify-center gap-4 md:flex-row">
        {footerPages.map((item) => (
          <Link href={item.url} key={item.url}>
            {item.label}
          </Link>
        ))}
      </div>
      <div className="text-muted/90 flex h-1/2 w-full items-center justify-center text-sm">
        © {new Date().getFullYear()} ყველა უფლება დაცულია | BLITZ
      </div>
    </Surface>
  )
}

export default FooterSecondary
