'use client'

import { Bell, Menu } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AdminNavbarProps {
  user: any
}

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const initials = user?.email?.substring(0, 2).toUpperCase() || 'AD'

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#e2e8f0] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search or title - for now empty */}
        <div className="flex-1 lg:ml-0" />

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications - optional */}
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> */}
          </button>

          {/* User info */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-[#8b9474] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}