// src/features/peta/ui/PetaLapaddeClient.tsx
'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

import MapLegend from '@/features/peta/ui/MapLegend';
import FacilityStats from '@/features/peta/ui/FacilityStats';
import CategoryFilter from '@/features/peta/ui/CategoryFilter';
import boundaryData from '@/features/peta/data/boundary.json';
import { Facility, FacilityCategory } from '@/features/peta/types';
import { FACILITY_ICONS } from '@/features/peta/utils/facility-icons';

// MapWithBoundaryMask DIIMPORT DINAMIS, TANPA SSR
const MapWithBoundaryMask = dynamic(
  () => import('@/components/map/MapWithBoundaryMask'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
        <p className="text-[#718096]">Memuat peta...</p>
      </div>
    ),
  },
);

interface Props {
  facilities: Facility[];
}

export default function PetaLapaddeClient({ facilities }: Props) {
  // Kategori unik dari data DB
  const allCategories = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.category))) as FacilityCategory[],
    [facilities],
  );

  const [activeCategories, setActiveCategories] = useState<FacilityCategory[]>(allCategories);

  // Filter fasilitas berdasarkan kategori aktif
  const filteredFacilities = facilities.filter((f) => activeCategories.includes(f.category));

  // Marker untuk peta
  const markers = filteredFacilities.map((facility) => ({
    id: facility.id,
    lat: facility.latitude,
    lng: facility.longitude,
    title: facility.name,
    icon: FACILITY_ICONS[facility.category],
  }));

  return (
    <>
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
          <FacilityStats facilities={facilities} />
        </div>
      </section>
    </>
  );
}
