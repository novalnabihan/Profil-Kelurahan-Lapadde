'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Users, MapPin, Building2, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: FileText,
    label: 'Profil Kelurahan',
    href: '/profil',
  },
  {
    icon: Users,
    label: 'Struktur Organisasi',
    href: '/struktur',
  },
  {
    icon: Building2,
    label: 'Data RT/RW',
    href: '/rt-rw',
  },
  {
    icon: MapPin,
    label: 'Peta & Fasilitas',
    href: '/peta',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden" id="sidebar-overlay" />
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#2d3748] transform lg:translate-x-0 transition-transform duration-200 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-white/10">
            <div className="w-10 h-10 bg-[#8b9474] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">Admin Panel</h1>
              <p className="text-white/60 text-xs">Kelurahan Lapadde</p>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8b9474] text-white'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}