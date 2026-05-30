import Link from 'next/link'
import { isAuthenticated } from '@/lib/auth'
import { LogoutButton } from '@/components/LogoutButton'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()

  return (
    <div className="min-h-screen flex flex-col">
      {authed && (
        <header className="bg-[#0B1F4B] border-b border-[#C9A84C]/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <nav className="flex items-center gap-6">
              <Link href="/admin" className="text-[#C9A84C] font-bold text-sm tracking-wider">
                TDR Admin
              </Link>
              <Link href="/admin/attractions" className="text-[#e8dfc8]/70 hover:text-[#e8dfc8] text-sm transition-colors">
                アトラクション管理
              </Link>
              <Link href="/" className="text-[#e8dfc8]/40 hover:text-[#e8dfc8]/70 text-sm transition-colors">
                サイトを見る
              </Link>
            </nav>
            <LogoutButton />
          </div>
        </header>
      )}
      <div className="flex-1">{children}</div>
    </div>
  )
}
