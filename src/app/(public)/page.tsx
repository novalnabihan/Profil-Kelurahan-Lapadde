//app/%28public%29/page.tsx

import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import HeroSection from '@/features/site/ui/HeroSection';
import ServicesSection from '@/features/site/ui/ServicesSection';
import VisionMissionSection from '@/features/site/ui/VisionMissionSection';
import StrukturSection from '@/features/struktur/ui/StrukturSection';
import EventsPreviewSection from '@/features/events/ui/EventsPreviewSection';
import PetaSimpleSection from '@/features/peta/ui/PetaSimpleSection';
import prisma from '@/lib/prisma';

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

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <MainNavbar />
      <main>
        <HeroSection stats={{
          rtRwCount: data.stats.rwCount,
          population: 4823,
          familyCount: 1245,
          area: '3.2 km²',
        }} />
        <ServicesSection />
        <VisionMissionSection
          vision={data.profile?.vision}
          mission={data.profile?.mission}
        />
        <StrukturSection members={data.struktur} />
        <PetaSimpleSection />
        {data.events.length > 0 && (
          <EventsPreviewSection events={data.events} />
        )}
      </main>
      <MainFooter />
    </>
  );
}