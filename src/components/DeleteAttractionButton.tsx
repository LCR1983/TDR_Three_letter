'use client'

import { useRouter } from 'next/navigation'

interface DeleteAttractionButtonProps {
  id: string
  name: string
}

export function DeleteAttractionButton({ id, name }: DeleteAttractionButtonProps) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return

    const res = await fetch(`/api/admin/attractions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('削除に失敗しました')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
    >
      削除
    </button>
  )
}
