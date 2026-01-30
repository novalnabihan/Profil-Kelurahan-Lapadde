//app/%28public%29/peta-lapadde/page.tsx

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import MapLegend from '@/features/peta/ui/MapLegend';
import FacilityStats from '@/features/peta/ui/FacilityStats';
import CategoryFilter from '@/features/peta/ui/CategoryFilter';
import boundaryData from '@/features/peta/data/boundary.json';
import { Facility, FacilityCategory } from '@/features/peta/types';
import { FACILITY_ICONS } from '@/features/peta/utils/facility-icons';
import MapWithBoundaryMask from '@/components/map/MapWithBoundaryMask';

const MapWithBoundary = dynamic(
  () => import('@/components/map/MapWithBoundary'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
        <p className="text-[#718096]">Memuat peta...</p>
      </div>
    ),
  }
);

// Mock data - TODO: fetch from API
const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'Kantor Kelurahan Lapadde',
    category: 'kantor',
    address: 'Jl. Raya Kelurahan No. 45',
    latitude: 1.1195,
    longitude: 104.0460,
  },
  {
    id: '2',
    name: 'SDN 01 Lapadde',
    category: 'sekolah',
    address: 'Jl. Pendidikan No. 12',
    latitude: 1.1185,
    longitude: 104.0455,
  },
  {
    id: '3',
    name: 'SDN 02 Lapadde',
    category: 'sekolah',
    address: 'Jl. Cendekia No. 8',
    latitude: 1.1200,
    longitude: 104.0470,
  },
  {
    id: '4',
    name: 'SMPN 5 Batam',
    category: 'sekolah',
    address: 'Jl. Pelajar No. 3',
    latitude: 1.1190,
    longitude: 104.0448,
  },
  {
    id: '5',
    name: 'Masjid Al-Ikhlas',
    category: 'masjid',
    address: 'Jl. Makmur No. 5',
    latitude: 1.1188,
    longitude: 104.0462,
  },
  {
    id: '6',
    name: 'Masjid Nurul Huda',
    category: 'masjid',
    address: 'Jl. Harmoni No. 10',
    latitude: 1.1198,
    longitude: 104.0452,
  },
  {
    id: '7',
    name: 'Masjid Ar-Rahman',
    category: 'masjid',
    address: 'Jl. Damai No. 7',
    latitude: 1.1182,
    longitude: 104.0468,
  },
  {
    id: '8',
    name: 'Puskesmas Lapadde',
    category: 'puskesmas',
    address: 'Jl. Sehat No. 1',
    latitude: 1.1193,
    longitude: 104.0465,
  },
  {
    id: '9',
    name: 'Taman Kota Lapadde',
    category: 'taman',
    address: 'Jl. Hijau No. 2',
    latitude: 1.1187,
    longitude: 104.0458,
  },
  {
    id: '10',
    name: 'Lapangan Sepak Bola Lapadde',
    category: 'lapangan',
    address: 'Jl. Olahraga No. 15',
    latitude: 1.1202,
    longitude: 104.0463,
  },
  {
    id: '11',
    name: 'Pasar Lapadde',
    category: 'pasar',
    address: 'Jl. Pasar No. 20',
    latitude: 1.1178,
    longitude: 104.0453,
  },
  {
    id: '12',
    name: 'Posyandu Melati',
    category: 'posyandu',
    address: 'Jl. Sehat No. 8',
    latitude: 1.1197,
    longitude: 104.0467,
  },
  {
    id: '13',
    name: 'Bank BRI Unit Lapadde',
    category: 'bank',
    address: 'Jl. Ekonomi No. 25',
    latitude: 1.1183,
    longitude: 104.0472,
  },
];

export default function PetaLapaddePage() {
  const allCategories = Array.from(
    new Set(mockFacilities.map((f) => f.category))
  ) as FacilityCategory[];

  const [activeCategories, setActiveCategories] = useState<FacilityCategory[]>(allCategories);

  // Filter facilities based on active categories
  const filteredFacilities = mockFacilities.filter((f) =>
    activeCategories.includes(f.category)
  );

  // Prepare markers for map
  const markers = filteredFacilities.map((facility) => ({
    id: facility.id,
    lat: facility.latitude,
    lng: facility.longitude,
    title: facility.name,
    icon: FACILITY_ICONS[facility.category],
  }));

  return (
    <>
      <MainNavbar />

      <main className="min-h-screen bg-[#f8f9fa]">
        {/* Header */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-10">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
              Peta Kelurahan Lapadde
            </h1>
            <p className="text-[15px] text-[#718096]">
              Lokasi sarana dan prasarana di wilayah Kelurahan Lapadde
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-6 bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6">
            <CategoryFilter
              categories={allCategories}
              activeCategories={activeCategories}
              onChange={setActiveCategories}
            />
          </div>
        </section>

        {/* Map */}
        <section className="py-10">
          <div className="max-w-[1140px] mx-auto px-6">
            <MapWithBoundaryMask
              markers={markers}
              boundaryGeoJSON={boundaryData}
              height="600px"
              zoom={14}
            />
          </div>
        </section>

        {/* Legend */}
        <section className="py-6">
          <div className="max-w-[1140px] mx-auto px-6">
            <MapLegend categories={activeCategories} />
          </div>
        </section>

        {/* Statistics */}
        <section className="py-10 bg-white">
          <div className="max-w-[1140px] mx-auto px-6">
            <FacilityStats facilities={mockFacilities} />
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
}