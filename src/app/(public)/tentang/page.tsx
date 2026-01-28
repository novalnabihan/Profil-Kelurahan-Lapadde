import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import prisma from '@/lib/prisma';

async function getAboutData() {
  const profile = await prisma.siteProfile.findFirst();
  return profile;
}

export default async function TentangPage() {
  const profile = await getAboutData();

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-[#f8f9fa]">
        {/* Header */}
        <section className="bg-white border-b border-[#e2e8f0]">
          <div className="max-w-[1140px] mx-auto px-6 py-10">
            <h1 className="text-[26px] md:text-[30px] font-semibold text-[#1a202c] mb-2">
              Tentang Kelurahan Lapadde
            </h1>
            <p className="text-[15px] text-[#718096]">
              Profil dan informasi umum Kelurahan Lapadde
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14">
          <div className="max-w-[1140px] mx-auto px-6">
            <div className="bg-white rounded-lg border border-[#e2e8f0] p-8 md:p-10">
              {profile?.about ? (
                <div className="prose prose-lg max-w-none">
                  {profile.about.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="text-[15px] text-[#4a5568] leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-[#718096]">Informasi tentang kelurahan belum tersedia.</p>
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