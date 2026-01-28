import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import { createAdminClient } from '@/lib/supabase/admin'

// Helper function to extract path from Supabase URL
function getStoragePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Format: /storage/v1/object/public/bucket-name/path/to/file.jpg
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/)
    return pathMatch ? pathMatch[1] : null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const { isAdmin, user } = await checkIsAdmin()
    console.log('Uploading file for user:', user?.email)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string
    const oldUrl = formData.get('oldUrl') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (8MB)
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const path = `${folder}/${filename}`

    const supabase = createAdminClient()

    // Delete old file if exists
    if (oldUrl) {
      const oldPath = getStoragePathFromUrl(oldUrl)
      if (oldPath) {
        console.log('Deleting old file:', oldPath)
        const { error: deleteError } = await supabase.storage
          .from('lapadde-assets')
          .remove([oldPath])
        
        if (deleteError) {
          console.error('Failed to delete old file:', deleteError)
          // Don't fail upload if delete fails
        } else {
          console.log('Old file deleted successfully')
        }
      }
    }

    // Upload new file
    const { data, error } = await supabase.storage
      .from('lapadde-assets')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('lapadde-assets')
      .getPublicUrl(path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin auth
    const { isAdmin } = await checkIsAdmin()

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
    }

    const path = getStoragePathFromUrl(url)
    if (!path) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase.storage
      .from('lapadde-assets')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}