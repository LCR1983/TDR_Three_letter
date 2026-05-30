import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const park = request.nextUrl.searchParams.get('park')
  const areaCode = request.nextUrl.searchParams.get('areaCode')

  const attractions = await prisma.attraction.findMany({
    where: {
      status: 'PUBLISHED',
      ...(park ? { park } : {}),
      ...(areaCode ? { area: { code: areaCode } } : {}),
    },
    include: { area: true },
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(attractions)
}
