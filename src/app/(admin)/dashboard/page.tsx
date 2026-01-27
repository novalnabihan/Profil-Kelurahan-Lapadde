import { Building2, Users, MapPin, Image } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatsCard from '@/components/admin/StatsCard'
import Link from 'next/link'
import prisma from '@/lib/prisma'

async function getDashboardStats() {
  const [rwCount, rtCount, strukturCount, facilityCount] = await Promise.all([
    prisma.rtRw.count({ where: { type: 'RW' } }),
    prisma.rtRw.count({ where: { type: 'RT' } }),
    prisma.struktur.count(),
    // prisma.facility.count(), // Uncomment when Facility model exists
  ])

  return {
    rwCount,
    rtCount,
    strukturCount,
    facilityCount: 0, // Placeholder
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a202c] mb-2">Dashboard</h1>
        <p className="text-[#718096]">
          Selamat datang di panel admin Kelurahan Lapadde
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total RW"
          value={stats.rwCount}
          icon={Building2}
          description="Rukun Warga"
        />
        <StatsCard
          title="Total RT"
          value={stats.rtCount}
          icon={Users}
          description="Rukun Tetangga"
        />
        <StatsCard
          title="Struktur Organisasi"
          value={stats.strukturCount}
          icon={Users}
          description="Anggota"
        />
        <StatsCard
          title="Sarana & Prasarana"
          value={stats.facilityCount}
          icon={MapPin}
          description="Lokasi"
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-lg">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-[#8b9474]/5 hover:border-[#8b9474]"
            >
              <Link href="/admin/struktur">
                <Users className="w-5 h-5 mb-2 text-[#8b9474]" />
                <span className="font-semibold text-sm">Kelola Struktur</span>
                <span className="text-xs text-[#718096] mt-1">
                  Tambah/edit struktur organisasi
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-[#8b9474]/5 hover:border-[#8b9474]"
            >
              <Link href="/admin/rt-rw">
                <Building2 className="w-5 h-5 mb-2 text-[#8b9474]" />
                <span className="font-semibold text-sm">Kelola RT/RW</span>
                <span className="text-xs text-[#718096] mt-1">
                  Tambah/edit data RT dan RW
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-[#8b9474]/5 hover:border-[#8b9474]"
            >
              <Link href="/admin/profil">
                <Image className="w-5 h-5 mb-2 text-[#8b9474]" />
                <span className="font-semibold text-sm">Edit Profil</span>
                <span className="text-xs text-[#718096] mt-1">
                  Update visi, misi, dan info
                </span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-[#8b9474]/5 hover:border-[#8b9474]"
            >
              <Link href="/admin/peta">
                <MapPin className="w-5 h-5 mb-2 text-[#8b9474]" />
                <span className="font-semibold text-sm">Kelola Peta</span>
                <span className="text-xs text-[#718096] mt-1">
                  Tambah/edit lokasi fasilitas
                </span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity - Optional */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#718096]">
            <p className="text-sm">Belum ada aktivitas terbaru</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}