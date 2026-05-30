import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TDR アトラクション情報',
    template: '%s | TDR アトラクション情報',
  },
  description: '東京ディズニーリゾートのアトラクション情報を専門オペレーション知識とともに掲載するサイトです。',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: 'TDR アトラクション情報',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
