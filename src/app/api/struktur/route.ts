import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'

// GET all struktur
export async function GET() {
  try {
    const struktur = await prisma.struktur.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(struktur)
  } catch (error) {
    console.error('Get struktur error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

// POST new struktur
export async function POST(request: NextRequest) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, position, photoUrl, order } = body

    const struktur = await prisma.struktur.create({
      data: {
        name,
        position,
        photoUrl,
        order,
      },
    })

    return NextResponse.json(struktur)
  } catch (error) {
    console.error('Create struktur error:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}