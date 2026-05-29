'use client'

import Link from 'next/link'
import { ThreeLetterBadge } from './ThreeLetterBadge'
import { StatusBadge } from './StatusBadge'

interface AttractionCardProps {
  threeLetterCode: string
  name: string
  englishName: string
  status: string
  hasDPA: boolean
  hasSingleRider: boolean
  park: string
  areaCode: string
}

export function AttractionCard({
  threeLetterCode,
  name,
  status,
  hasDPA,
  hasSingleRider,
  park,
  areaCode,
}: AttractionCardProps) {
  const href = `/${park}/${encodeURIComponent(areaCode)}/${threeLetterCode}`

  return (
    <Link href={href}>
      <div className="bg-[#0B1F4B]/60 border border-[#C9A84C]/20 rounded-lg p-4 hover:border-[#C9A84C]/60 hover:bg-[#0B1F4B]/80 transition-all duration-200 group min-h-[120px] flex flex-col justify-between">
        <div>
          <ThreeLetterBadge code={threeLetterCode} size="md" />
          <p className="mt-2 text-white text-sm font-medium leading-tight line-clamp-2">{name}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <StatusBadge status={status} />
          {hasDPA && (
            <span className="text-xs bg-purple-900/50 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded">
              DPA
            </span>
          )}
          {hasSingleRider && (
            <span className="text-xs bg-blue-900/50 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
              SR
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
