import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import StrukturList from '@/features/struktur/ui/StrukturList'

async function getStrukturData() {
  const struktur = await prisma.struktur.findMany({
    orderBy: { order: 'asc' },
  })
  return struktur
}

export default async function StrukturPage() {
  const { isAdmin } = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/admin/login')
  }

  const struktur = await getStrukturData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a202c]">Struktur Organisasi</h1>
          <p className="text-[#718096] mt-1">
            Kelola struktur organisasi kelurahan
          </p>
        </div>
      </div>

      {/* List */}
      <StrukturList initialData={struktur} />
    </div>
  )
}