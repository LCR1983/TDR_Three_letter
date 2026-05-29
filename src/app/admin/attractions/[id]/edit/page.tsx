import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AttractionForm } from '@/components/AttractionForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const attraction = await prisma.attraction.findUnique({ where: { id } })
  return { title: attraction ? `${attraction.name} 編集 | Admin` : '編集 | Admin' }
}

export default async function EditAttractionPage({ params }: PageProps) {
  const { id } = await params

  const attraction = await prisma.attraction.findUnique({
    where: { id },
    include: { area: true },
  })

  if (!attraction) notFound()

  const totalSec = attraction.durationSec ?? 0
  const durationMin = Math.floor(totalSec / 60).toString()
  const durationSec = (totalSec % 60).toString()

  const initialData = {
    park: attraction.park,
    areaId: attraction.areaId,
    threeLetterCode: attraction.threeLetterCode,
    name: attraction.name,
    englishName: attraction.englishName,
    openDate: attraction.openDate ?? '',
    sponsor: attraction.sponsor ?? '',
    rideSystem: attraction.rideSystem ?? '',
    isIndoor: attraction.isIndoor,
    durationMin,
    durationSec,
    capacity: attraction.capacity?.toString() ?? '',
    vehicleNote: attraction.vehicleNote ?? '',
    promiseTime: attraction.promiseTime?.toString() ?? '',
    dispatchTime: attraction.dispatchTime?.toString() ?? '',
    rotationClass: attraction.rotationClass ?? '',
    rotationNote: attraction.rotationNote ?? '',
    hasDPA: attraction.hasDPA,
    hasSingleRider: attraction.hasSingleRider,
    passNote: attraction.passNote ?? '',
    heightMin: attraction.heightMin?.toString() ?? '',
    restrictionNote: attraction.restrictionNote ?? '',
    bgs: attraction.bgs ?? '',
    details: attraction.details ?? '',
    operationNotes: attraction.operationNotes ?? '',
    status: attraction.status,
    statusNote: attraction.statusNote ?? '',
    sortOrder: attraction.sortOrder.toString(),
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/attractions" className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-sm">
          ← アトラクション一覧に戻る
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <span className="font-mono text-2xl font-bold text-[#C9A84C]">
            {attraction.threeLetterCode}
          </span>
          <h1 className="text-xl font-bold text-white">{attraction.name}</h1>
        </div>
        <p className="text-[#e8dfc8]/40 text-sm mt-1">アトラクション情報を編集</p>
      </div>

      <AttractionForm initial={initialData} attractionId={id} />
    </main>
  )
}
