'use client'

interface StatusBadgeProps {
  status: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: '公開中', className: 'bg-green-100 text-green-800 border border-green-300' },
  DRAFT: { label: '下書き', className: 'bg-gray-100 text-gray-600 border border-gray-300' },
  MAINTENANCE: { label: '休止中', className: 'bg-yellow-100 text-yellow-800 border border-yellow-300' },
  CLOSED: { label: '閉鎖済み', className: 'bg-red-100 text-red-700 border border-red-300' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }

  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.className}`}>
      {config.label}
    </span>
  )
}
