import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ park: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { park } = await params
  const parkName = park === 'TDL' ? '東京ディズニーランド' : park === 'TDS' ? '東京ディズニーシー' : park
  return { title: parkName }
}

export default async function ParkPage({ params }: PageProps) {
  const { park } = await params

  if (park !== 'TDL' && park !== 'TDS') notFound()

  const parkName = park === 'TDL' ? '東京ディズニーランド' : '東京ディズニーシー'
  const parkNameEn = park === 'TDL' ? 'Tokyo Disneyland' : 'Tokyo DisneySea'

  const areas = await prisma.area.findMany({
    where: { park },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <main className="min-h-screen px-4 py-8 max-w-4xl mx-auto">
      <Link href="/" className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-sm transition-colors">
        ← トップへ戻る
      </Link>

      <div className="mt-6 mb-10">
        <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase">{parkNameEn}</p>
        <h1 className="text-3xl font-bold text-[#C9A84C] mt-1">{parkName}</h1>
        <p className="text-[#e8dfc8]/60 text-sm mt-1">エリアを選択してください</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {areas.map((area) => (
          <Link key={area.id} href={`/${park}/${encodeURIComponent(area.code)}`}>
            <div className="bg-[#0B1F4B]/60 border border-[#C9A84C]/20 rounded-xl p-4 hover:border-[#C9A84C]/60 hover:bg-[#0B1F4B]/80 transition-all duration-200 group min-h-[100px] flex flex-col justify-between">
              <p className="font-mono text-2xl font-bold text-[#C9A84C] tracking-widest">{area.code}</p>
              <div>
                <p className="text-white text-sm font-medium mt-2">{area.name}</p>
                <p className="text-[#e8dfc8]/40 text-xs mt-0.5">{area.englishName}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
