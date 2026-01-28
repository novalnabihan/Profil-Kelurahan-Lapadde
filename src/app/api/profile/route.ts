import { NextRequest, NextResponse } from 'next/server'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    // Check admin auth
    const { isAdmin } = await checkIsAdmin()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { about, vision, mission, officeMap, complaintFlow } = body

    // Get or create profile
    let profile = await prisma.siteProfile.findFirst()

    if (!profile) {
      // Create new profile
      profile = await prisma.siteProfile.create({
        data: {
          about,
          vision,
          mission,
          officeMap,
          complaintFlow,
        },
      })
    } else {
      // Update existing profile
      profile = await prisma.siteProfile.update({
        where: { id: profile.id },
        data: {
          about,
          vision,
          mission,
          officeMap,
          complaintFlow,
        },
      })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}