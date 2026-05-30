import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const park = request.nextUrl.searchParams.get('park')

  const areas = await prisma.area.findMany({
    where: park ? { park } : undefined,
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(areas)
}
