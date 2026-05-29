import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Breadcrumb } from '@/components/Breadcrumb'
import { ThreeLetterBadge } from '@/components/ThreeLetterBadge'
import { RotationClassBadge } from '@/components/RotationClassBadge'
import { StatusBadge } from '@/components/StatusBadge'
import { MarkdownContent } from '@/components/MarkdownContent'

interface PageProps {
  params: Promise<{ park: string; areaCode: string; threeLetterCode: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { threeLetterCode } = await params
  const attraction = await prisma.attraction.findUnique({
    where: { threeLetterCode: threeLetterCode.toUpperCase() },
    include: { area: true },
  })
  return attraction
    ? { title: `${attraction.threeLetterCode} ${attraction.name}`, description: attraction.englishName }
    : { title: threeLetterCode }
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return `${s}秒`
  if (s === 0) return `${m}分`
  return `${m}分${s}秒`
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3 py-2 border-b border-[#C9A84C]/10 last:border-0">
      <span className="text-[#e8dfc8]/50 text-sm w-40 shrink-0">{label}</span>
      <span className="text-white text-sm">{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl p-5 mb-5">
      <h2 className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default async function AttractionDetailPage({ params }: PageProps) {
  const { park, areaCode, threeLetterCode } = await params
  const decodedArea = decodeURIComponent(areaCode)

  const attraction = await prisma.attraction.findUnique({
    where: { threeLetterCode: threeLetterCode.toUpperCase() },
    include: { area: true },
  })

  if (!attraction || (attraction.status !== 'PUBLISHED' && attraction.status !== 'CLOSED')) {
    notFound()
  }

  const parkName = park === 'TDL' ? '東京ディズニーランド' : '東京ディズニーシー'

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'TOP', href: '/' },
          { label: parkName, href: `/${park}` },
          { label: decodedArea, href: `/${park}/${encodeURIComponent(decodedArea)}` },
          { label: attraction.threeLetterCode },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <ThreeLetterBadge code={attraction.threeLetterCode} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <StatusBadge status={attraction.status} />
            </div>
            <h1 className="text-2xl font-bold text-white">{attraction.name}</h1>
            <p className="text-[#e8dfc8]/50 text-sm mt-0.5">{attraction.englishName}</p>
          </div>
        </div>
      </div>

      {/* 基本情報 */}
      <Section title="基本情報">
        {attraction.openDate && <InfoRow label="オープン日" value={attraction.openDate} />}
        {attraction.sponsor && <InfoRow label="スポンサー" value={attraction.sponsor} />}
        {attraction.rideSystem && <InfoRow label="ライドシステム" value={attraction.rideSystem} />}
        <InfoRow label="施設形態" value={attraction.isIndoor ? '屋内' : '屋外'} />
        <InfoRow label="エリア" value={`${attraction.area.name} (${attraction.area.code})`} />
      </Section>

      {/* 所要・定員 */}
      {(attraction.durationSec || attraction.capacity || attraction.vehicleNote) && (
        <Section title="所要・定員">
          {attraction.durationSec && (
            <InfoRow label="所要時間" value={formatDuration(attraction.durationSec)} />
          )}
          {attraction.capacity && (
            <InfoRow label="定員（1サイクル）" value={`${attraction.capacity}人`} />
          )}
          {attraction.vehicleNote && (
            <InfoRow label="ビークル構成" value={attraction.vehicleNote} />
          )}
        </Section>
      )}

      {/* オペレーション情報 */}
      {(attraction.promiseTime || attraction.dispatchTime || attraction.rotationClass) && (
        <Section title="オペレーション情報">
          {attraction.promiseTime && (
            <InfoRow label="プロミスタイム" value={`${attraction.promiseTime}分`} />
          )}
          {attraction.dispatchTime && (
            <InfoRow label="ディスパッチ所要時間" value={`${attraction.dispatchTime}秒`} />
          )}
          {attraction.rotationClass && (
            <InfoRow
              label="回転効率クラス"
              value={<RotationClassBadge rotationClass={attraction.rotationClass} />}
            />
          )}
          {attraction.rotationNote && (
            <InfoRow label="補足" value={attraction.rotationNote} />
          )}
        </Section>
      )}

      {/* パス・サービス */}
      {(attraction.hasDPA || attraction.hasSingleRider || attraction.passNote) && (
        <Section title="パス・サービス">
          {attraction.hasDPA && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-green-400">✓</span>
              <span className="text-white text-sm">ディズニー・プレミアアクセス対象</span>
            </div>
          )}
          {attraction.hasSingleRider && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-green-400">✓</span>
              <span className="text-white text-sm">シングルライダー対象</span>
            </div>
          )}
          {attraction.passNote && (
            <p className="text-[#e8dfc8]/70 text-sm mt-2">{attraction.passNote}</p>
          )}
        </Section>
      )}

      {/* 利用制限 */}
      {(attraction.heightMin || attraction.restrictionNote) && (
        <Section title="利用制限">
          {attraction.heightMin && (
            <InfoRow label="最低身長制限" value={`${attraction.heightMin}cm以上`} />
          )}
          {attraction.restrictionNote && (
            <p className="text-[#e8dfc8]/70 text-sm mt-2">{attraction.restrictionNote}</p>
          )}
        </Section>
      )}

      {/* バックグラウンドストーリー */}
      {attraction.bgs && (
        <div className="mb-5">
          <h2 className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-3">
            バックグラウンドストーリー
          </h2>
          <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl p-5">
            <MarkdownContent content={attraction.bgs} />
          </div>
        </div>
      )}

      {/* アトラクション詳細 */}
      {attraction.details && (
        <div className="mb-5">
          <h2 className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-3">
            アトラクション詳細
          </h2>
          <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl p-5">
            <MarkdownContent content={attraction.details} />
          </div>
        </div>
      )}

      {/* 運営メモ */}
      {attraction.operationNotes && (
        <div className="mb-5">
          <h2 className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-3">
            運営メモ
          </h2>
          <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl p-5">
            <MarkdownContent content={attraction.operationNotes} />
          </div>
        </div>
      )}

      {/* ステータス補足 */}
      {attraction.statusNote && (
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300 text-sm">{attraction.statusNote}</p>
        </div>
      )}
    </main>
  )
}
