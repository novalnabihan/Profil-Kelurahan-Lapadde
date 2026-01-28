import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'

// GET all RT/RW
export async function GET() {
  try {
    const data = await prisma.rtRw.findMany({
      orderBy: [{ type: 'asc' }, { order: 'asc' }],
      include: {
        rtChildren: {
          orderBy: { order: 'asc' },
        },
      },
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Get RT/RW error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST new RT/RW
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      type,
      number,
      leader,
      phone,
      address,
      latitude,
      longitude,
      photoUrl,
      order,
      rwParentId,
    } = body

    const data = await prisma.rtRw.create({
      data: {
        type,
        number,
        leader,
        phone,
        address,
        latitude,
        longitude,
        photoUrl,
        order,
        rwParentId: type === 'RT' ? rwParentId : null,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Create RT/RW error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}