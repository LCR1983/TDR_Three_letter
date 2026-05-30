import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: '管理ダッシュボード | Admin' }

export default async function AdminDashboard() {
  const [total, published, draft, maintenance, recent] = await Promise.all([
    prisma.attraction.count(),
    prisma.attraction.count({ where: { status: 'PUBLISHED' } }),
    prisma.attraction.count({ where: { status: 'DRAFT' } }),
    prisma.attraction.count({ where: { status: 'MAINTENANCE' } }),
    prisma.attraction.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { area: true },
    }),
  ])

  const stats = [
    { label: '総アトラクション数', value: total, color: 'text-white' },
    { label: '公開中', value: published, color: 'text-green-400' },
    { label: '下書き', value: draft, color: 'text-gray-400' },
    { label: '休止中', value: maintenance, color: 'text-yellow-400' },
  ]

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#C9A84C]">ダッシュボード</h1>
        <Link
          href="/admin/attractions/new"
          className="bg-[#C9A84C] hover:bg-[#C9A84C]/90 text-[#071529] font-bold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + 新規アトラクション追加
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#0B1F4B]/60 border border-[#C9A84C]/15 rounded-xl p-5">
            <p className="text-[#e8dfc8]/50 text-xs mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-[#C9A84C] text-sm font-bold tracking-widest uppercase mb-4">最近の更新</h2>
      <div className="bg-[#0B1F4B]/40 border border-[#C9A84C]/15 rounded-xl overflow-hidden">
        {recent.length === 0 ? (
          <p className="text-center text-[#e8dfc8]/40 py-8">データがありません</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A84C]/10">
                <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">コード</th>
                <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3">名前</th>
                <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3 hidden md:table-cell">エリア</th>
                <th className="text-left text-[#e8dfc8]/50 text-xs px-4 py-3 hidden md:table-cell">更新日</th>
                <th className="text-right text-[#e8dfc8]/50 text-xs px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id} className="border-b border-[#C9A84C]/5 last:border-0 hover:bg-[#C9A84C]/5">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[#C9A84C] font-bold">{a.threeLetterCode}</span>
                  </td>
                  <td className="px-4 py-3 text-white text-sm">{a.name}</td>
                  <td className="px-4 py-3 text-[#e8dfc8]/50 text-sm hidden md:table-cell">{a.area.code}</td>
                  <td className="px-4 py-3 text-[#e8dfc8]/40 text-xs hidden md:table-cell">
                    {new Date(a.updatedAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/attractions/${a.id}/edit`}
                      className="text-[#C9A84C] hover:text-[#C9A84C]/70 text-xs"
                    >
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 text-right">
        <Link href="/admin/attractions" className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-sm">
          すべてのアトラクションを表示 →
        </Link>
      </div>
    </main>
  )
}
