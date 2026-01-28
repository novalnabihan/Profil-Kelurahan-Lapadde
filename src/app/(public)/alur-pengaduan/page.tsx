import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import Image from 'next/image';
import prisma from '@/lib/prisma';

async function getAlurData() {
  const profile = await prisma.siteProfile.findFirst();
  return profile;
}

export default async function AlurPengaduanPage() {
  const profile = await getAlurData();

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-[#f8f9fa]">
        {/* Header */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-10">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
              Alur Pengaduan Warga
            </h1>
            <p className="text-[15px] text-[#718096]">
              Prosedur dan tahapan pengaduan masyarakat
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-8">
              {profile?.complaintFlow ? (
                <div className="relative w-full">
                  <Image
                    src={profile.complaintFlow}
                    alt="Alur Pengaduan"
                    width={1200}
                    height={800}
                    className="w-full h-auto rounded-lg"
                    priority
                  />
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-[48px] mb-4">📋</div>
                  <p className="text-[#718096]">Alur pengaduan belum tersedia.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <MainFooter />
    </>
  );
}