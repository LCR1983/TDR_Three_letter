'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'ログインに失敗しました')
      }
    } catch {
      setError('通信エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[#C9A84C]/60 text-xs tracking-widest uppercase mb-1">TDR Attraction DB</p>
          <h1 className="text-2xl font-bold text-[#C9A84C]">管理者ログイン</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0B1F4B]/60 border border-[#C9A84C]/20 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-[#e8dfc8]/70 text-sm mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-[#071529] border border-[#C9A84C]/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] hover:bg-[#C9A84C]/90 disabled:opacity-50 text-[#071529] font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  )
}
