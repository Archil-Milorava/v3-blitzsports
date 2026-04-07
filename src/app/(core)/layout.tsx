import Footer from '@/src/components/footer/Footer'
import Navbar from '@/src/components/navbar/Navbar'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blitz Sport News',
  description: 'Blitz Sport News',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}
