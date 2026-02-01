// app/(public)/peta-lapadde/page.tsx

import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import prisma from '@/lib/prisma';
import PetaLapaddeClient from '@/features/peta/ui/PetaLapaddeClient';
import type { FacilityCategory } from '@/features/peta/types';

// Supaya selalu render di server (baca dari DB) tiap request
export const dynamic = 'force-dynamic';

export default async function PetaLapaddePage() {
  // Ambil data fasilitas dari DB
  const facilitiesFromDb = await prisma.facility.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Mapping ke shape Facility (features/peta/types.ts)
  const facilities = facilitiesFromDb.map((f) => ({
    id: f.id,
    name: f.name,
    // Prisma pakai string, kita cast ke union type kita sendiri
    category: f.category as FacilityCategory,
    address: f.address ?? undefined,
    latitude: f.latitude,
    longitude: f.longitude,
    description: f.description ?? undefined,
  }));

  return (
    <>
      <MainNavbar />

      <main className="min-h-screen bg-[#f8f9fa]">
        <PetaLapaddeClient facilities={facilities} />
      </main>

      <MainFooter />
    </>
  );
}
