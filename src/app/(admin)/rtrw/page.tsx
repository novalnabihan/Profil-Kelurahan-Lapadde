import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import RtRwManager from '@/features/rt-rw/ui/RtRwManager'

async function getRtRwData() {
  const data = await prisma.rtRw.findMany({
    orderBy: [{ type: 'asc' }, { order: 'asc' }],
    include: {
      rtChildren: {
        orderBy: { order: 'asc' },
      },
    },
  })

  // Group by RW
  const rwList = data.filter((item) => item.type === 'RW')

  return rwList
}

export default async function RtRwAdminPage() {
  const { isAdmin } = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/admin/login')
  }

  const rwData = await getRtRwData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Data RT/RW</h1>
        <p className="text-[#718096] mt-1">
          Kelola data ketua RT dan RW di wilayah kelurahan
        </p>
      </div>

      {/* Manager */}
      <RtRwManager initialData={rwData} />
    </div>
  )
}