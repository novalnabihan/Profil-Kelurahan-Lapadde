import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import RwCard from '@/features/rt-rw/ui/RwCard';
import LeafletMap from '@/components/map/LeafletMap';
import prisma from '@/lib/prisma';

async function getRwData() {
  const rwData = await prisma.rtRw.findMany({
    where: { type: 'RW' },
    orderBy: { order: 'asc' },
  });

  return rwData;
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

            {rwData.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rwData.map((rw) => (
                  <RwCard key={rw.id} data={rw} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-[#e2e8f0]">
                <p className="text-[#718096]">Belum ada data RW</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </>
  );
}