'use client'

interface RotationClassBadgeProps {
  rotationClass: string
}

const classConfig: Record<string, { label: string; bg: string; text: string }> = {
  E: { label: 'Eクラス', bg: 'bg-red-600', text: 'text-white' },
  D: { label: 'Dクラス', bg: 'bg-orange-500', text: 'text-white' },
  C: { label: 'Cクラス', bg: 'bg-yellow-500', text: 'text-black' },
  B: { label: 'Bクラス', bg: 'bg-green-600', text: 'text-white' },
  A: { label: 'Aクラス', bg: 'bg-blue-600', text: 'text-white' },
}

export function RotationClassBadge({ rotationClass }: RotationClassBadgeProps) {
  const config = classConfig[rotationClass] ?? { label: rotationClass, bg: 'bg-gray-500', text: 'text-white' }

  return (
    <span className={`${config.bg} ${config.text} text-sm font-bold px-3 py-1 rounded-full`}>
      {config.label}
    </span>
  )
}
