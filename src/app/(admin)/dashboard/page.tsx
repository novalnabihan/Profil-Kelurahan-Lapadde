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
          Selamat datang di panel admin Kelurahan Lapadde!
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
 

      {/* Recent Activity - Optional */}

    </div>
  )
}