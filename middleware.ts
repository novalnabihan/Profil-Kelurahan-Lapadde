import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // No session, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // TODO: Check if user.email exists in Admin table
    // For now, we'll check in the page component

    return supabaseResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}