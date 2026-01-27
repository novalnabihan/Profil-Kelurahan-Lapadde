import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import HeroSection from '@/features/site/ui/HeroSection';
import ServicesSection from '@/features/site/ui/ServicesSection';
import VisionMissionSection from '@/features/site/ui/VisionMissionSection';
import StrukturSection from '@/features/struktur/ui/StrukturSection';
import PetaSimpleSection from '@/features/peta/ui/PetaSimpleSection';
import EventsPreviewSection from '@/features/events/ui/EventsPreviewSection';
import ContactSection from '@/features/site/ui/ContactSection';

// TODO: Fetch from API/database
async function getHomeData() {
  // const profile = await fetch('/api/profile').then(r => r.json());
  // const struktur = await fetch('/api/struktur').then(r => r.json());
  // const events = await fetch('/api/kegiatan?limit=3').then(r => r.json());
  
  // Mock data for now
  return {
    profile: {
      vision: "Terwujudnya Kelurahan Lapadde yang Sejahtera, Aman, Nyaman, dan Berbudaya",
      mission: `Meningkatkan kualitas pelayanan publik kepada masyarakat
Memberdayakan ekonomi masyarakat melalui UMKM
Menjaga keamanan dan ketertiban lingkungan
Meningkatkan partisipasi masyarakat dalam pembangunan
Melestarikan nilai-nilai budaya lokal`,
    },
    struktur: [
      { id: '1', name: 'Drs. Ahmad Santoso, M.Si', position: 'Lurah', order: 0 },
      { id: '2', name: 'Sri Wahyuni, S.Sos', position: 'Sekretaris Lurah', order: 1 },
      { id: '3', name: 'Budi Prasetyo, S.AP', position: 'Kasi Pemerintahan', order: 2 },
      { id: '4', name: 'Siti Aminah, S.Sos', position: 'Kasi Kesejahteraan', order: 3 },
      { id: '5', name: 'Eko Wijaya, S.T', position: 'Kasi Pembangunan', order: 4 },
    ],
    events: [
      {
        id: '1',
        title: 'Gotong Royong Bersih Lingkungan RT 03/RW 05',
        slug: 'gotong-royong-bersih-lingkungan',
        content: 'Kegiatan gotong royong dilaksanakan di RT 03/RW 05 dengan diikuti oleh 45 warga untuk menjaga kebersihan lingkungan.',
        eventDate: new Date('2026-01-15'),
      },
      {
        id: '2',
        title: 'Sosialisasi Program Posyandu Balita',
        slug: 'sosialisasi-posyandu',
        content: 'Program untuk meningkatkan kesehatan balita di wilayah kelurahan.',
        eventDate: new Date('2026-01-12'),
      },
      {
        id: '3',
        title: 'Rapat Koordinasi RT/RW',
        slug: 'rapat-koordinasi-rt-rw',
        content: 'Membahas program kerja bulan Januari bersama ketua RT dan RW.',
        eventDate: new Date('2026-01-08'),
      },
    ],
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <MainNavbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <VisionMissionSection 
          vision={data.profile.vision}
          mission={data.profile.mission}
        />
        <StrukturSection members={data.struktur} />
        <PetaSimpleSection />

        {/* <EventsPreviewSection events={data.events} /> */}
        <ContactSection />
      </main>
      <MainFooter />
    </>
  );
}