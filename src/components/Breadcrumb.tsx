'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-[#C9A84C]/70 mb-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <span className="text-[#C9A84C]/40">&gt;</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#C9A84C] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#C9A84C]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
