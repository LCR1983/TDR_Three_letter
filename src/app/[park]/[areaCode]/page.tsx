import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/Breadcrumb'
import { AttractionCard } from '@/components/AttractionCard'

interface PageProps {
  params: Promise<{ park: string; areaCode: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { park, areaCode } = await params
  const decoded = decodeURIComponent(areaCode)
  const area = await prisma.area.findUnique({ where: { park_code: { park, code: decoded } } })
  return { title: area ? `${area.name} | ${park}` : areaCode }
}

export default async function AreaPage({ params }: PageProps) {
  const { park, areaCode } = await params
  const decoded = decodeURIComponent(areaCode)

  if (park !== 'TDL' && park !== 'TDS') notFound()

  const area = await prisma.area.findUnique({
    where: { park_code: { park, code: decoded } },
  })

  if (!area) notFound()

  const attractions = await prisma.attraction.findMany({
    where: {
      areaId: area.id,
      status: { in: ['PUBLISHED', 'CLOSED'] },
    },
    include: { area: true },
    orderBy: { sortOrder: 'asc' },
  })

  const parkName = park === 'TDL' ? '東京ディズニーランド' : '東京ディズニーシー'

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'TOP', href: '/' },
          { label: parkName, href: `/${park}` },
          { label: area.name },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-baseline gap-3">
          <p className="font-mono text-3xl font-bold text-[#C9A84C]">{area.code}</p>
          <h1 className="text-2xl font-bold text-white">{area.name}</h1>
        </div>
        <p className="text-[#e8dfc8]/50 text-sm mt-1">{area.englishName}</p>
      </div>

      {attractions.length === 0 ? (
        <div className="text-center py-20 text-[#e8dfc8]/40">
          <p>このエリアにはまだアトラクション情報がありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {attractions.map((attraction) => (
            <AttractionCard
              key={attraction.id}
              threeLetterCode={attraction.threeLetterCode}
              name={attraction.name}
              englishName={attraction.englishName}
              status={attraction.status}
              hasDPA={attraction.hasDPA}
              hasSingleRider={attraction.hasSingleRider}
              park={park}
              areaCode={decoded}
            />
          ))}
        </div>
      )}
    </main>
  )
}
