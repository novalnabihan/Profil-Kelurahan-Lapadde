import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

function getStoragePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET single struktur
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const struktur = await prisma.struktur.findUnique({
      where: { id },
    })

    if (!struktur) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(struktur)
  } catch (error) {
    console.error('Get struktur error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PATCH update struktur
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, position, photoUrl, order } = body

    // Get existing data
    const existing = await prisma.struktur.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Delete old photo if changed
    if (existing.photoUrl && photoUrl !== existing.photoUrl) {
      const oldPath = getStoragePathFromUrl(existing.photoUrl)
      if (oldPath) {
        const supabase = createAdminClient()
        await supabase.storage.from('lapadde-assets').remove([oldPath])
      }
    }

    const struktur = await prisma.struktur.update({
      where: { id },
      data: {
        name,
        position,
        photoUrl,
        order,
      },
    })

    return NextResponse.json(struktur)
  } catch (error) {
    console.error('Update struktur error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE struktur
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get existing data
    const existing = await prisma.struktur.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Delete photo from storage
    if (existing.photoUrl) {
      const path = getStoragePathFromUrl(existing.photoUrl)
      if (path) {
        const supabase = createAdminClient()
        await supabase.storage.from('lapadde-assets').remove([path])
      }
    }

    await prisma.struktur.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete struktur error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}