export const runtime = 'nodejs'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function checkIsAdmin(): Promise<{
  isAdmin: boolean
  user: any | null
}> {
  const supabase = await createServerSupabaseClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isAdmin: false, user: null }
  }

  // Check if user email exists in Admin table
  const admin = await prisma.admin.findUnique({
    where: { email: user.email! },
  })

  return {
    isAdmin: !!admin,
    user,
  }
}