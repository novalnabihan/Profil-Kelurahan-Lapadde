// src/features/rt-rw/ui/RtRwMap.tsx
'use client';

import MapWithBoundaryMask from '@/components/map/MapWithBoundaryMask';
import { KELURAHAN_BOUNDARY } from '@/features/rt-rw/data/rw-boundaries';
import type { RtRw } from '@/generated/prisma/';

interface Props {
  rwList: RtRw[];
}

export default function RtRwMap({ rwList }: Props) {
  // Ambil RW yang punya koordinat
  const markers = rwList
    .filter((rw) => rw.latitude && rw.longitude)
    .map((rw) => ({
      id: rw.id,
      lat: rw.latitude as number,
      lng: rw.longitude as number,
      title: `RW ${rw.number}`,
      icon: '🏛️',
    }));

  return (
    <MapWithBoundaryMask
      markers={markers}
      boundaryGeoJSON={KELURAHAN_BOUNDARY}
      zoom={15}
      height="450px"
      showControls={true}
    />
  );
}
