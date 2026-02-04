// src/app/(admin)/struktur/page.tsx

import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import StrukturList from '@/features/struktur/ui/StrukturList'

export const dynamic = 'force-dynamic'

async function getStrukturData() {
  return prisma.struktur.findMany({
    orderBy: [
      { roleCategory: 'asc' },
      { unit: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  })
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
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">
          Struktur Organisasi
        </h1>
        <p className="text-[#718096] mt-1 max-w-2xl">
          Kelola susunan jabatan, unit kerja, dan anggota struktur organisasi
          Kelurahan Lapadde.
        </p>
      </div>

      <StrukturList initialData={struktur} />
    </div>
  )
}
