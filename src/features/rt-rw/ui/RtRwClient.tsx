'use client';

import dynamic from 'next/dynamic';
import type { RtRw } from '@/generated/prisma/';

// ⚠️ MAP DIIMPORT DINAMIS
const RtRwMap = dynamic(
  () => import('@/features/rt-rw/ui/RtRwMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[450px] flex items-center justify-center text-[#718096]">
        Memuat peta...
      </div>
    ),
  }
);

interface Props {
  rwList: RtRw[];
}

export default function RtRwClient({ rwList }: Props) {
  return (
    <>
      <section className="bg-white border-b border-[#e2e8f0]">
        <div className="max-w-[1140px] mx-auto px-6 py-10">
          <h1 className="text-[26px] font-semibold text-[#1a202c]">
            RT / RW Kelurahan Lapadde
          </h1>
          <p className="text-[15px] text-[#718096] mt-1">
            Informasi lokasi dan kontak Ketua RT dan RW
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-[1140px] mx-auto px-6">
          <RtRwMap rwList={rwList} />
        </div>
      </section>
    </>
  );
}
