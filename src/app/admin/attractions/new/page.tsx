import Link from 'next/link'
import type { Metadata } from 'next'
import { AttractionForm } from '@/components/AttractionForm'

export const metadata: Metadata = { title: '新規アトラクション追加 | Admin' }

export default function NewAttractionPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/attractions" className="text-[#C9A84C]/60 hover:text-[#C9A84C] text-sm">
          ← アトラクション一覧に戻る
        </Link>
        <h1 className="text-2xl font-bold text-[#C9A84C] mt-3">新規アトラクション追加</h1>
      </div>
      <AttractionForm />
    </main>
  )
}
