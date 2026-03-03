import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'even',
  },
  description: '记录与实验，发生在生活、法律、科技与审美的交汇处。',
  icons: {
    icon: [
      {
        url: '/tablogo.jpg',
      },
    ],
    apple: '/tablogo.jpg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
        <SiteFooter />
        <Toaster theme="dark" position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
