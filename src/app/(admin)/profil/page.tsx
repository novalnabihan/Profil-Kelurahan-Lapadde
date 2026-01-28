import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/lib/auth/check-admin'
import prisma from '@/lib/prisma'
import ProfilForm from '@/features/profil/ui/ProfilForm'

async function getSiteProfile() {
  // Get first (and only) site profile record
  let profile = await prisma.siteProfile.findFirst()

  // If no profile exists, create one
  if (!profile) {
    profile = await prisma.siteProfile.create({
      data: {
        about: '',
        vision: '',
        mission: '',
        complaintFlow: '',
        officeMap: '',
      },
    })
  }

  return profile
}

export default async function ProfilPage() {
  const { isAdmin } = await checkIsAdmin()

  if (!isAdmin) {
    redirect('/admin/login')
  }

  const profile = await getSiteProfile()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c]">Profil Kelurahan</h1>
        <p className="text-[#718096] mt-1">
          Kelola informasi profil, visi & misi, denah kantor, dan alur pengaduan
        </p>
      </div>

      {/* Form */}
      <ProfilForm profile={profile} />
    </div>
  )
}