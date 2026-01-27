import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminNavbar from '@/components/admin/AdminNavbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, user } = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f7fafc]">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNavbar user={user} />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}