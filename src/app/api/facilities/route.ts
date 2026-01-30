//app/api/facilities/route.ts


import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'

// GET all facilities
export async function GET() {
  try {
    const facilities = await prisma.facility.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(facilities)
  } catch (error) {
    console.error('Get facilities error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST new facility
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, category, address, latitude, longitude, description } = body

    const facility = await prisma.facility.create({
      data: {
        name,
        category,
        address,
        latitude,
        longitude,
        description,
      },
    })

    return NextResponse.json(facility)
  } catch (error) {
    console.error('Create facility error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}