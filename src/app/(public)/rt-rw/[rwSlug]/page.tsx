// src/app/(public)/rt-rw/[rwSlug]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import MainNavbar from '@/components/layout/MainNavbar'
import MainFooter from '@/components/layout/MainFooter'
import RwLeaderCard from '@/features/rt-rw/ui/RwLeaderCard'
import RtCard from '@/features/rt-rw/ui/RtCard'
import RwDetailMap from '@/features/rt-rw/ui/RwDetailMap'
import prisma from '@/lib/prisma'
import boundaryData from '@/features/peta/data/boundary.json'

export const dynamic = 'force-dynamic'

// Fetch RW with RT children
async function getRwDetailBySlug(slug: string) {
  // Extract RW number from slug (e.g., "rw-01" -> "01")
  const rwNumber = slug.replace('rw-', '')

  const rwData = await prisma.rtRw.findFirst({
    where: {
      type: 'RW',
      number: rwNumber,
    },
    include: {
      rtChildren: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return rwData
}

// Generate static params for existing RW
export async function generateStaticParams() {
  const rwList = await prisma.rtRw.findMany({
    where: { type: 'RW' },
    select: { number: true },
  })

  return rwList.map((rw) => ({
    rwSlug: `rw-${rw.number}`,
  }))
}

interface PageProps {
  params: Promise<{ rwSlug: string }>
}

export default async function RwDetailPage({ params }: PageProps) {
  const { rwSlug } = await params

  if (!rwSlug) {
    notFound()
  }

  const rwData = await getRwDetailBySlug(rwSlug)

  if (!rwData) {
    notFound()
  }

  const rtChildren = rwData.rtChildren ?? []

  // Map markers (RW + RT yang punya koordinat)
  const mapMarkers = [
    ...(rwData.latitude && rwData.longitude
      ? [
          {
            id: rwData.id,
            lat: rwData.latitude,
            lng: rwData.longitude,
            title: `RW ${rwData.number}`,
            subtitle: rwData.leader,
            type: 'RW' as const,
          },
        ]
      : []),
    ...rtChildren
      .filter((rt) => rt.latitude && rt.longitude)
      .map((rt) => ({
        id: rt.id,
        lat: rt.latitude!,
        lng: rt.longitude!,
        title: `RT ${rt.number}`,
        subtitle: rt.leader,
        type: 'RT' as const,
      })),
  ]

  return (
    <>
      <MainNavbar />

      <main className="min-h-screen bg-[#f8f9fa]">
        {/* Breadcrumb */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-4">
            <nav className="flex items-center gap-2 text-[14px]">
              <Link href="/" className="text-[#8b9474] hover:text-[#6d7558]">
                Beranda
              </Link>
              <span className="text-[#cbd5e0]">/</span>
              <Link href="/rt-rw" className="text-[#8b9474] hover:text-[#6d7558]">
                RT/RW
              </Link>
              <span className="text-[#cbd5e0]">/</span>
              <span className="text-[#4a5568] font-medium">RW {rwData.number}</span>
            </nav>
          </div>
        </section>

        {/* Header */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-10">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
              RW {rwData.number}
            </h1>
            <p className="text-[15px] text-[#718096]">
              Informasi ketua RW dan daftar RT di RW {rwData.number}
            </p>
          </div>
        </section>

        {/* Map */}
        <section className="py-10">
          <div className="max-w-[1140px] mx-auto px-6">
            <h2 className="text-[20px] font-semibold text-[#1a202c] mb-4">
              Peta Lokasi RW {rwData.number} &amp; RT
            </h2>

            <RwDetailMap markers={mapMarkers} boundaryGeoJSON={boundaryData} />
          </div>
        </section>

        {/* RW Leader */}
        <section className="py-10 bg-white">
          <div className="max-w-[1140px] mx-auto px-6">
            <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
              Ketua RW
            </h2>
            <div className="max-w-2xl">
              {/* rwData sudah bentuk Prisma, tapi struct-nya sama dengan RtRwData */}
              <RwLeaderCard data={rwData as any} />
            </div>
          </div>
        </section>

        {/* RT List */}
        {rtChildren.length > 0 ? (
          <section className="py-10">
            <div className="max-w-[1140px] mx-auto px-6">
              <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
                Daftar RT di RW {rwData.number}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rtChildren.map((rt) => (
                  <RtCard key={rt.id} data={rt as any} rwNumber={rwData.number} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-10">
            <div className="max-w-[1140px] mx-auto px-6">
              <div className="text-center py-12 bg-white rounded-lg border border-[#e2e8f0]">
                <p className="text-[#718096]">Belum ada data RT di RW ini</p>
              </div>
            </div>
          </section>
        )}
      </main>

      <MainFooter />
    </>
  )
}
