import LoginForm from '@/features/auth/ui/LoginForm'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLoginPage() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8b9474] to-[#6d7558] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#8b9474] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1a202c] mb-2">Admin Panel</h1>
            <p className="text-[#718096] text-sm">Kelurahan Lapadde</p>
          </div>

          {/* Login Form */}
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          © 2026 Kelurahan Lapadde. All rights reserved.
        </p>
      </div>
    </div>
  )
}
