// src/app/(public)/rt-rw/page.tsx

import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import RwCard from '@/features/rt-rw/ui/RwCard';
import { RtRwData } from '@/features/rt-rw/types';
import LeafletMap from '@/components/map/LeafletMap';

// TODO: Fetch from API / Prisma
async function getRwData(): Promise<RtRwData[]> {
  return [
    {
      id: '1',
      type: 'RW',
      number: '01',
      leader: 'Budi Santoso, S.Sos',
      phone: '0812-3456-7890',
      address: 'Jl. Merdeka No. 10, Batam Kota',
      latitude: 1.1195,
      longitude: 104.0457,
      photoUrl: '',
      order: 1,
    },
    {
      id: '2',
      type: 'RW',
      number: '02',
      leader: 'Siti Aminah, S.Pd',
      phone: '0813-4567-8901',
      address: 'Jl. Sudirman No. 25, Batam Kota',
      latitude: 1.12,
      longitude: 104.047,
      photoUrl: '',
      order: 2,
    },
    {
      id: '3',
      type: 'RW',
      number: '03',
      leader: 'Andi Wijaya, S.T',
      phone: '0814-5678-9012',
      address: 'Jl. Ahmad Yani No. 15, Batam Kota',
      latitude: 1.1185,
      longitude: 104.0445,
      photoUrl: '',
      order: 3,
    },
  ];
}

export default async function RtRwPage() {
  const rwData = await getRwData();

  const mapMarkers = rwData
    .filter((rw) => rw.latitude && rw.longitude)
    .map((rw) => ({
      id: rw.id,
      lat: rw.latitude!,
      lng: rw.longitude!,
      title: `RW ${rw.number}`,
      subtitle: rw.leader,
      type: 'RW' as const,
    }));

  return (
    <>
      <MainNavbar />

      <main className="min-h-screen bg-[#f8f9fa]">
        {/* Hero */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-10">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
              RT/RW Kelurahan Lapadde
            </h1>
            <p className="text-[15px] text-[#718096]">
              Informasi kontak ketua RT dan RW di wilayah Kelurahan Lapadde
            </p>
          </div>
        </section>

        {/* Map */}
        <section className="py-10">
          <div className="max-w-[1140px] mx-auto px-6">
            <h2 className="text-[20px] font-semibold text-[#1a202c] mb-4">
              Peta Lokasi RW
            </h2>

            <LeafletMap
              markers={mapMarkers}
              zoom={14}
              height="450px"
            />
          </div>
        </section>

        {/* RW List */}
        <section className="py-10">
          <div className="max-w-[1140px] mx-auto px-6">
            <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
              Daftar RW
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rwData.map((rw) => (
                <RwCard key={rw.id} data={rw} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
}
