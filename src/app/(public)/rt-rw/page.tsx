// app/(public)/rt-rw/page.tsx
import MainNavbar from '@/components/layout/MainNavbar';
import MainFooter from '@/components/layout/MainFooter';
import prisma from '@/lib/prisma';
import RtRwClient from '@/features/rt-rw/ui/RtRwClient';

export const dynamic = 'force-dynamic';

export default async function RtRwPage() {
  const rwList = await prisma.rtRw.findMany({
    where: { type: 'RW' },
    orderBy: { order: 'asc' },
  });

  return (
    <>
      <MainNavbar />
      <main className="min-h-screen bg-[#f8f9fa]">
        <RtRwClient rwList={rwList} />
      </main>
      <MainFooter />
    </>
  );
}
