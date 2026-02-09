//app/%28public%29/page.tsx

import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import HeroSection from '@/features/site/ui/HeroSection';
import VisionMissionSection from '@/features/site/ui/VisionMissionSection';
import StrukturSection from '@/features/struktur/ui/StrukturSection';
import { getHeroStats } from '@/features/site/data/getHeroStats'
import PetaSimpleSection from '@/features/peta/ui/PetaSimpleSection';
import AlurPengaduanSection from '@/features/alur-pengaduan/ui/AlurPengaduanSection';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs'


async function getHomeData() {
  // Fetch site profile
  const profile = await prisma.siteProfile.findFirst();

  // Fetch struktur
  const struktur = await prisma.struktur.findMany({
    orderBy: { order: 'asc' },
  });

  // Fetch events (preview 3 latest)
  const events = await prisma.event.findMany({
    orderBy: { eventDate: 'desc' },
    take: 3,
  });

  // Count stats
  const [rwCount, rtCount] = await Promise.all([
    prisma.rtRw.count({ where: { type: 'RW' } }),
    prisma.rtRw.count({ where: { type: 'RT' } }),
  ]);

  return {
    profile,
    struktur,
    events,
    stats: {
      rwCount,
      rtCount,
    },
  };
}

export const dynamic = 'force-dynamic' // optional: kalau stats sering berubah

export default async function HomePage() {
  const data = await getHomeData();
  const stats = await getHeroStats()

  return (
    <>
      <MainNavbar />
      <main>
        <HeroSection stats={stats} />

        {/* <ServicesSection /> */}
        <VisionMissionSection
          vision={data.profile?.vision}
          mission={data.profile?.mission}
        />
        <StrukturSection members={data.struktur} />
        <PetaSimpleSection />
      <AlurPengaduanSection/>
        {/* {data.events.length > 0 && (
          <EventsPreviewSection events={data.events} />
        )} */}
      </main>
      <MainFooter />
    </>
  );
}