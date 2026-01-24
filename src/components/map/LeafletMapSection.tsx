// src/components/map/LeafletMapSection.tsx

'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(
  () => import('@/components/map/LeafletMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-[#f8f9fa] rounded-lg flex items-center justify-center border border-[#e2e8f0]">
        <p className="text-[#718096]">Memuat peta...</p>
      </div>
    ),
  }
);

type Marker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: 'RW' | 'RT';
};

type Props = {
  markers: Marker[];
  height?: string;
  zoom?: number;
};

export default function LeafletMapSection({
  markers,
  height = '450px',
  zoom = 15,
}: Props) {
  return <LeafletMap markers={markers} height={height} zoom={zoom} />;
}
