// src/features/peta/ui/PetaSimpleSection.tsx
'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import boundaryData from '../data/boundary.json';
import BoundaryInfoBox from './BoundaryInfoBox';
import { BoundaryInfo } from '../types';

const MapWithBoundary = dynamic(
  () => import('@/components/map/MapWithBoundary'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
        <p className="text-[#718096]">Memuat peta...</p>
      </div>
    ),
  }
);

const boundaryInfo: BoundaryInfo = {
  north: 'Kelurahan Sungai Panas',
  south: 'Kelurahan Tanjung Uma',
  west: 'Kelurahan Belian',
  east: 'Kelurahan Sukajadi',
  area: '3.2 km²',
};

export default function PetaSimpleSection() {
  // Marker tunggal: Kantor Kelurahan
  const markers = [
    {
      id: 'kantor-lapadde',
      lat: -3.9946681101589094,      // TODO: pakai koordinat kantor real
      lng: 119.65056736411529,
      title: 'Kantor Kelurahan Lapadde',
      subtitle: 'Lokasi kantor lurah',
      icon: '🏛️',
    },
  ];

  return (
    <section className="py-14 bg-white scroll-mt-[120px]" id="peta">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#1a202c] mb-8">
          Peta Wilayah Kelurahan
        </h2>

        <div className="mb-6">
          <MapWithBoundary
            markers={markers}
            boundaryGeoJSON={boundaryData}
            height="400px"
            zoom={14}
          />
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
          {/* <BoundaryInfoBox info={boundaryInfo} /> */}

          <Link
            href="/peta-lapadde"
            className="bg-[#8b9474] text-white px-6 py-3 rounded-lg font-medium text-[14px] hover:bg-[#6d7558] transition-colors whitespace-nowrap flex items-center gap-2 justify-center md:self-end"
          >
            <span>🗺️</span>
            <span>Lihat Peta Lengkap</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
