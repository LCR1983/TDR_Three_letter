import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const areas = await prisma.area.findMany({
    orderBy: [{ park: 'asc' }, { sortOrder: 'asc' }],
  })

  return NextResponse.json(areas)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const area = await prisma.area.create({
      data: {
        park: body.park,
        code: body.code,
        name: body.name,
        englishName: body.englishName,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
    })
    return NextResponse.json(area, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
