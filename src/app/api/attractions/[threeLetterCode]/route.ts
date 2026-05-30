import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ threeLetterCode: string }> }
) {
  const { threeLetterCode } = await params
  const admin = await isAuthenticated()

  const attraction = await prisma.attraction.findUnique({
    where: { threeLetterCode: threeLetterCode.toUpperCase() },
    include: { area: true },
  })

  if (!attraction) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!admin && attraction.status !== 'PUBLISHED' && attraction.status !== 'CLOSED') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(attraction)
}
