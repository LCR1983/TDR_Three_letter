'use client'

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[#e8dfc8]/40 hover:text-red-400 text-xs transition-colors"
    >
      ログアウト
    </button>
  )
}
