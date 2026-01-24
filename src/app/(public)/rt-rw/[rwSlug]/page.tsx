// src/app/(public)/rt-rw/[rwSlug]/page.tsx

import Link from 'next/link';
import { notFound } from 'next/navigation';

import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';

import LeafletMapSection from '@/components/map/LeafletMapSection';

import RwLeaderCard from '@/features/rt-rw/ui/RwLeaderCard';
import RtCard from '@/features/rt-rw/ui/RtCard';
import { RwWithRts } from '@/features/rt-rw/types';

// Opsional: pastikan selalu SSR
export const dynamic = 'force-dynamic';

// Pre-generate rute (boleh kamu tambah lagi)
export async function generateStaticParams() {
  return [
    { rwSlug: 'rw-01' },
    { rwSlug: 'rw-02' },
    { rwSlug: 'rw-03' },
  ];
}

// ==============================
// Mock Fetch by slug
// ==============================
async function getRwDetailBySlug(slug: string): Promise<RwWithRts | null> {
  const mockData: Record<string, RwWithRts> = {
    'rw-01': {
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
      rtChildren: [
        {
          id: 'rt-1',
          type: 'RT',
          number: '01',
          rwParentId: '1',
          leader: 'Agus Setiawan',
          phone: '0815-1234-5678',
          address: 'Jl. Melati No. 5',
          latitude: 1.1193,
          longitude: 104.0455,
          photoUrl: '',
          order: 1,
        },
        {
          id: 'rt-2',
          type: 'RT',
          number: '02',
          rwParentId: '1',
          leader: 'Dewi Lestari',
          phone: '0816-2345-6789',
          address: 'Jl. Mawar No. 12',
          latitude: 1.1197,
          longitude: 104.0459,
          photoUrl: '',
          order: 2,
        },
        {
          id: 'rt-3',
          type: 'RT',
          number: '03',
          rwParentId: '1',
          leader: 'Eko Prasetyo',
          phone: '0817-3456-7890',
          address: 'Jl. Anggrek No. 8',
          latitude: 1.1192,
          longitude: 104.0462,
          photoUrl: '',
          order: 3,
        },
      ],
    },

    'rw-02': {
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
      rtChildren: [],
    },

    'rw-03': {
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
      rtChildren: [],
    },
  };

  return mockData[slug] ?? null;
}

// ==============================
// Page
// ==============================
interface PageProps {
  params: Promise<{ rwSlug: string }>; // ⬅ params adalah Promise
}

export default async function RwDetailPage({ params }: PageProps) {
  // UNWRAP params dulu
  const { rwSlug } = await params;
  const slug = rwSlug;

  if (!slug) {
    notFound();
  }

  const rwData = await getRwDetailBySlug(slug);

  if (!rwData) {
    notFound();
  }

  const rtChildren = rwData.rtChildren ?? [];

  // ==============================
  // Map Markers
  // ==============================
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
  ];

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
              <span className="text-[#4a5568] font-medium">
                RW {rwData.number}
              </span>
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
              Peta Lokasi RW {rwData.number} & RT
            </h2>

            <LeafletMapSection
              markers={mapMarkers}
              zoom={15}
              height="450px"
            />
          </div>
        </section>

        {/* RW Leader */}
        <section className="py-10 bg-white">
          <div className="max-w-[1140px] mx-auto px-6">
            <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
              Ketua RW
            </h2>
            <div className="max-w-2xl">
              <RwLeaderCard data={rwData} />
            </div>
          </div>
        </section>

        {/* RT List */}
        {rtChildren.length > 0 && (
          <section className="py-10">
            <div className="max-w-[1140px] mx-auto px-6">
              <h2 className="text-[20px] font-semibold text-[#1a202c] mb-6">
                Daftar RT di RW {rwData.number}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rtChildren.map((rt) => (
                  <RtCard
                    key={rt.id}
                    data={rt}
                    rwNumber={rwData.number}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <MainFooter />
    </>
  );
}
