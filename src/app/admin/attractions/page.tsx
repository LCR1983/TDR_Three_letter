import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { StatusBadge } from '@/components/StatusBadge'
import { DeleteAttractionButton } from '@/components/DeleteAttractionButton'

export const metadata: Metadata = { title: 'アトラクション管理 | Admin' }

interface PageProps {
  searchParams: Promise<{ park?: string; status?: string }>
}

export default async function AttractionsAdminPage({ searchParams }: PageProps) {
  const { park, status } = await searchParams

  const attractions = await prisma.attraction.findMany({
    where: {
      ...(park ? { park } : {}),
      ...(status ? { status } : {}),
    },
    include: { area: true },
    orderBy: [{ park: 'asc' }, { sortOrder: 'asc' }, { threeLetterCode: 'asc' }],
  })

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#C9A84C]">アトラクション管理</h1>
        <Link
          href="/admin/attractions/new"
          className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#071529] font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + 新規追加
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Link
          href="/admin/attractions"
          className={`px-3 py-1.5 rounded-lg text-sm border ${!park && !status ? 'bg-[#C9A84C] text-[#071529] border-[#C9A84C]' : 'border-[#C9A84C]/20 text-[#e8dfc8]/60 hover:border-[#C9A84C]/50'}`}
        >
          すべて
        </Link>
        {(['TDL', 'TDS'] as const).map((p) => (
          <Link
            key={p}
            href={`/admin/attractions?park=${p}`}
            className={`px-3 py-1.5 rounded-lg text-sm border ${park === p ? 'bg-[#C9A84C] text-[#071529] border-[#C9A84C]' : 'border-[#C9A84C]/20 text-[#e8dfc8]/60 hover:border-[#C9A84C]/50'}`}
          >
            {p}
          </Link>
        ))}
        {[
          { value: 'PUBLISHED', label: '公開中' },
          { value: 'DRAFT', label: '下書き' },
          { value: 'MAINTENANCE', label: '休止中' },
          { value: 'CLOSED', label: '閉鎖済み' },
        ].map((s) => (
          <Link
            key={s.value}
            href={`/admin/attractions?status=${s.value}`}
            className={`px-3 py-1.5 rounded-lg text-sm border ${status === s.value ? 'bg-[#C9A84C] text-[#071529] border-[#C9A84C]' : 'border-[#C9A84C]/20 text-[#e8dfc8]/60 hover:border-[#C9A84C]/50'}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        {attractions.length === 0 ? (
          <p className="text-center text-[#e8dfc8]/40 py-12">該当するアトラクションはありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#C9A84C]/10 bg-[#0B1F4B]/60">
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">コード</th>
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">名前</th>
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">パーク</th>
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">エリア</th>
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">ステータス</th>
                  <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3 hidden lg:table-cell">更新日</th>
                  <th className="text-right text-[#e8dfc8]/50 text-xs px-4 py-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {attractions.map((a) => (
                  <tr key={a.id} className="border-b border-[#C9A84C]/5 last:border-0 hover:bg-[#C9A84C]/5">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-[#C9A84C]">{a.threeLetterCode}</span>
                    </td>
                    <td className="px-4 py-3 text-white">{a.name}</td>
                    <td className="px-4 py-3 text-[#e8dfc8]/60">{a.park}</td>
                    <td className="px-4 py-3 text-[#e8dfc8]/60">{a.area.code}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3 text-[#e8dfc8]/40 text-xs hidden lg:table-cell">
                      {new Date(a.updatedAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-4 justify-end">
                        <Link
                          href={`/admin/attractions/${a.id}/edit`}
                          className="text-[#C9A84C] hover:text-[#C9A84C]/70 text-xs"
                        >
                          編集
                        </Link>
                        <DeleteAttractionButton id={a.id} name={a.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[#e8dfc8]/30 text-xs mt-4">{attractions.length}件</p>
    </main>
  )
}
