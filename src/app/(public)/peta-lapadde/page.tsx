'use client';

import { useEffect, useMemo, useState } from 'react';
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

// (Masih kita simpan dynamic import ini kalau suatu saat mau dipakai)
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

export default function PetaLapaddePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategories, setActiveCategories] = useState<FacilityCategory[]>([]);

  // --- Fetch data dari API / DB ---
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/facilities');
        if (!res.ok) {
          throw new Error('Gagal mengambil data fasilitas');
        }

        const data = await res.json();

        // Data dari API bentuknya prisma Facility (category: string),
        // kita anggap valid sebagai FacilityCategory
        setFacilities(data);
      } catch (err: any) {
        console.error('Fetch facilities error:', err);
        setError(err.message || 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // --- Kategori unik yang tersedia di DB ---
  const allCategories: FacilityCategory[] = useMemo(() => {
    const cats = Array.from(
      new Set(facilities.map((f) => f.category))
    ) as FacilityCategory[];

    return cats;
  }, [facilities]);

  // Set default active categories ketika data sudah ada
  useEffect(() => {
    if (allCategories.length > 0 && activeCategories.length === 0) {
      setActiveCategories(allCategories);
    }
  }, [allCategories, activeCategories.length]);

  // --- Filter fasilitas berdasarkan kategori aktif ---
  const filteredFacilities = useMemo(() => {
    if (activeCategories.length === 0) return [];

    return facilities.filter((f) =>
      activeCategories.includes(f.category)
    );
  }, [facilities, activeCategories]);

  // --- Markers untuk map ---
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
            {loading ? (
              <p className="text-[14px] text-[#718096]">
                Memuat data fasilitas...
              </p>
            ) : error ? (
              <p className="text-[14px] text-red-600">
                {error}
              </p>
            ) : allCategories.length === 0 ? (
              <p className="text-[14px] text-[#718096]">
                Belum ada data fasilitas yang terdaftar.
              </p>
            ) : (
              <CategoryFilter
                categories={allCategories}
                activeCategories={activeCategories}
                onChange={setActiveCategories}
              />
            )}
          </div>
        </section>

        {/* Map */}
        <section className="py-10">
          <div className="max-w-[1140px] mx-auto px-6">
            {loading ? (
              <div className="w-full h-[600px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
                <p className="text-[#718096]">Memuat peta...</p>
              </div>
            ) : (
              <MapWithBoundaryMask
                markers={markers}
                boundaryGeoJSON={boundaryData}
                height="600px"
                zoom={14}
              />
            )}
          </div>
        </section>

        {/* Legend */}
        <section className="py-6">
          <div className="max-w-[1140px] mx-auto px-6">
            {allCategories.length > 0 && (
              <MapLegend categories={allCategories} />
            )}
          </div>
        </section>

        {/* Statistics */}
        <section className="py-10 bg-white">
          <div className="max-w-[1140px] mx-auto px-6">
            {facilities.length > 0 ? (
              <FacilityStats facilities={facilities} />
            ) : loading ? (
              <p className="text-[14px] text-[#718096]">
                Menghitung statistik fasilitas...
              </p>
            ) : (
              <p className="text-[14px] text-[#718096]">
                Belum ada fasilitas yang dapat ditampilkan.
              </p>
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
}
