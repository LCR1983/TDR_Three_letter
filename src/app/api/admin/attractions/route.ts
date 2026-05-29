import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const park = request.nextUrl.searchParams.get('park')
  const areaCode = request.nextUrl.searchParams.get('areaCode')
  const status = request.nextUrl.searchParams.get('status')

  const attractions = await prisma.attraction.findMany({
    where: {
      ...(park ? { park } : {}),
      ...(areaCode ? { area: { code: areaCode } } : {}),
      ...(status ? { status } : {}),
    },
    include: { area: true },
    orderBy: [{ park: 'asc' }, { sortOrder: 'asc' }],
  })

  return NextResponse.json(attractions)
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const attraction = await prisma.attraction.create({
      data: {
        park: body.park,
        areaId: body.areaId,
        threeLetterCode: body.threeLetterCode.toUpperCase(),
        name: body.name,
        englishName: body.englishName,
        openDate: body.openDate || null,
        sponsor: body.sponsor || null,
        rideSystem: body.rideSystem || null,
        isIndoor: body.isIndoor ?? true,
        durationSec: body.durationSec ? Number(body.durationSec) : null,
        capacity: body.capacity ? Number(body.capacity) : null,
        vehicleNote: body.vehicleNote || null,
        promiseTime: body.promiseTime ? Number(body.promiseTime) : null,
        dispatchTime: body.dispatchTime ? Number(body.dispatchTime) : null,
        rotationClass: body.rotationClass || null,
        rotationNote: body.rotationNote || null,
        hasDPA: body.hasDPA ?? false,
        hasSingleRider: body.hasSingleRider ?? false,
        passNote: body.passNote || null,
        heightMin: body.heightMin ? Number(body.heightMin) : null,
        restrictionNote: body.restrictionNote || null,
        bgs: body.bgs || null,
        details: body.details || null,
        operationNotes: body.operationNotes || null,
        status: body.status ?? 'DRAFT',
        statusNote: body.statusNote || null,
        sortOrder: body.sortOrder ? Number(body.sortOrder) : 0,
      },
      include: { area: true },
    })

    return NextResponse.json(attraction, { status: 201 })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    if (msg.includes('Unique constraint')) {
      return NextResponse.json({ error: 'このスリーレターコードはすでに使用されています' }, { status: 409 })
    }
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
