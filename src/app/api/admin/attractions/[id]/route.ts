import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const attraction = await prisma.attraction.findUnique({
    where: { id },
    include: { area: true },
  })

  if (!attraction) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(attraction)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    const body = await request.json()
    const attraction = await prisma.attraction.update({
      where: { id },
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

    return NextResponse.json(attraction)
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  try {
    await prisma.attraction.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
