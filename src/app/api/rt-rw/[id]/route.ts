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

// GET single RT/RW
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const data = await prisma.rtRw.findUnique({
      where: { id },
      include: {
        rtChildren: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get RT/RW error:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// PATCH update RT/RW
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
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

    // Get existing data
    const existing = await prisma.rtRw.findUnique({ where: { id } })
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

    const data = await prisma.rtRw.update({
      where: { id },
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
    console.error('Update RT/RW error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE RT/RW
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get existing data with children
    const existing = await prisma.rtRw.findUnique({
      where: { id },
      include: { rtChildren: true },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const supabase = createAdminClient()

    // Delete photos from storage
    const photosToDelete: string[] = []

    // Main photo
    if (existing.photoUrl) {
      const path = getStoragePathFromUrl(existing.photoUrl)
      if (path) photosToDelete.push(path)
    }

    // Children photos (if RW)
    if (existing.type === 'RW' && existing.rtChildren) {
      for (const rt of existing.rtChildren) {
        if (rt.photoUrl) {
          const path = getStoragePathFromUrl(rt.photoUrl)
          if (path) photosToDelete.push(path)
        }
      }
    }

    // Delete all photos
    if (photosToDelete.length > 0) {
      await supabase.storage.from('lapadde-assets').remove(photosToDelete)
    }

    // Delete from database (cascade will delete children)
    await prisma.rtRw.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete RT/RW error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}