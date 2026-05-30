import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TDR アトラクション情報',
}

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="text-center mb-12">
        <p className="text-[#C9A84C]/60 text-sm tracking-[0.4em] uppercase mb-2">Tokyo Disney Resort</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#C9A84C] mb-3">
          アトラクション情報
        </h1>
        <p className="text-[#e8dfc8]/60 text-sm">
          スリーレター・オペレーション情報データベース
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/TDL">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1F4B] to-[#071529] border border-[#C9A84C]/30 rounded-2xl p-8 hover:border-[#C9A84C]/70 hover:shadow-lg hover:shadow-[#C9A84C]/10 transition-all duration-300 group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-full" />
            <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mb-1">Tokyo Disneyland</p>
            <h2 className="text-2xl font-bold text-white group-hover:text-[#C9A84C] transition-colors">
              東京ディズニーランド
            </h2>
            <p className="text-[#C9A84C] font-mono text-4xl font-bold mt-3 tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">
              TDL
            </p>
          </div>
        </Link>

        <Link href="/TDS">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0B1F4B] to-[#071529] border border-[#C9A84C]/30 rounded-2xl p-8 hover:border-[#C9A84C]/70 hover:shadow-lg hover:shadow-[#C9A84C]/10 transition-all duration-300 group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/5 rounded-bl-full" />
            <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mb-1">Tokyo DisneySea</p>
            <h2 className="text-2xl font-bold text-white group-hover:text-[#C9A84C] transition-colors">
              東京ディズニーシー
            </h2>
            <p className="text-[#C9A84C] font-mono text-4xl font-bold mt-3 tracking-widest opacity-30 group-hover:opacity-60 transition-opacity">
              TDS
            </p>
          </div>
        </Link>
      </div>

      <p className="mt-12 text-[#e8dfc8]/30 text-xs text-center">
        ※ このサイトは非公式の個人運営サイトです。東京ディズニーリゾートとは無関係です。
      </p>
    </main>
  )
}
