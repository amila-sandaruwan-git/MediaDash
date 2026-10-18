// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // 👈 global styles
import './mediadash-design.css'   // 👈 same folder as layout.tsx (app/)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediaDash - Download Videos, Audio & Thumbnails',
  description: 'Download videos, audio and thumbnails from YouTube, Facebook, Instagram, TikTok and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}