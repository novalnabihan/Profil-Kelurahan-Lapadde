// src/features/rt-rw/ui/RtRwClient.tsx
'use client'

import dynamic from 'next/dynamic'
import boundaryData from '@/features/peta/data/boundary.json'
import RwCard from './RwCard'
import type { RtRwData } from '../types'

// Dynamic import MapWithBoundaryMask (Leaflet, butuh window)
const MapWithBoundaryMask = dynamic(
  () => import('@/components/map/MapWithBoundaryMask'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
        <p className="text-[#718096]">Memuat peta...</p>
      </div>
    ),
  }
)

interface RtRwClientProps {
  // Bentuknya sama dengan RtRwData, tapi tanpa rtChildren
  rwList: RtRwData[]
}

export default function RtRwClient({ rwList }: RtRwClientProps) {
  // Siapkan marker hanya untuk RW yang punya koordinat
  const markers = rwList
    .filter((rw) => rw.latitude && rw.longitude)
    .map((rw) => ({
      id: rw.id,
      lat: rw.latitude as number,
      lng: rw.longitude as number,
      title: `RW ${rw.number}`,
      icon: '🏛️',
    }))

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1140px] mx-auto px-6 py-10">
          <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
            RT / RW Kelurahan Lapadde
          </h1>
          <p className="text-[15px] text-[#718096]">
            Informasi lokasi dan kontak Ketua RT dan RW
          </p>
        </div>
      </section>

      {/* Map RT/RW */}
      <section className="py-10">
        <div className="max-w-[1140px] mx-auto px-6">
          <h2 className="text-[20px] font-semibold text-[#1a202c] mb-4">
            Peta Lokasi Ketua RW
          </h2>

          <MapWithBoundaryMask
            markers={markers}
            boundaryGeoJSON={boundaryData}
            height="450px"
            zoom={14}
          />
        </div>
      </section>

      {/* Daftar Ketua RW */}
      <section className="py-10 bg-white border-t border-[#e2e8f0]">
        <div className="max-w-[1140px] mx-auto px-6">
          <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
            Daftar Ketua RW
          </h2>

          {rwList.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#e2e8f0] rounded-lg">
              <p className="text-[#718096]">
                Belum ada data Ketua RW yang diinput.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rwList.map((rw) => (
                <RwCard key={rw.id} data={rw} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
