//app/api/facilities/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single facility
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const facility = await prisma.facility.findUnique({
      where: { id },
    })

    if (!facility) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(facility)
  } catch (error) {
    console.error('Get facility error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PATCH update facility
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, category, address, latitude, longitude, description } = body

    const facility = await prisma.facility.update({
      where: { id },
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
    console.error('Update facility error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE facility
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.facility.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete facility error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}