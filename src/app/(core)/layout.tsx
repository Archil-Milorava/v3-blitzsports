import Footer from '@/src/components/footer/Footer'
import Navbar from '@/src/components/navbar/Navbar'

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
