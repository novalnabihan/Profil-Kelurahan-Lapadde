import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import FacilityManager from '@/features/peta/ui/FacilityManager'

async function getFacilityData() {
  const facilities = await prisma.facility.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return facilities
}

export default async function PetaAdminPage() {
  const { isAdmin } = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/admin/login')
  }

  const facilities = await getFacilityData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Peta & Fasilitas</h1>
        <p className="text-[#718096] mt-1">
          Kelola lokasi sarana dan prasarana kelurahan
        </p>
      </div>

      {/* Manager */}
      <FacilityManager initialData={facilities} />
    </div>
  )
}