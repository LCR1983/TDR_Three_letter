'use client'

interface ThreeLetterBadgeProps {
  code: string
  size?: 'sm' | 'md' | 'lg'
}

export function ThreeLetterBadge({ code, size = 'md' }: ThreeLetterBadgeProps) {
  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-xl px-3 py-1',
    lg: 'text-4xl px-6 py-3',
  }

  return (
    <span
      className={`font-mono font-bold tracking-widest bg-[#0B1F4B] text-[#C9A84C] rounded border border-[#C9A84C]/40 inline-block ${sizeClasses[size]}`}
    >
      {code}
    </span>
  )
}
