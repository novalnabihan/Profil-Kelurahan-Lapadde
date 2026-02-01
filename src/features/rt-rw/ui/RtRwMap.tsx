'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leaflet-config';

import type { RtRw } from '@/generated/prisma';

interface Props {
  rwList: RtRw[];
}

export default function RtRwMap({ rwList }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(
      [-3.9857, 119.6693],
      14
    );

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    rwList.forEach((rw) => {
      if (!rw.latitude || !rw.longitude) return;

      L.marker([rw.latitude, rw.longitude]).addTo(map)
        .bindPopup(`<strong>RW ${rw.number}</strong><br/>${rw.leader}`);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [rwList]);

  return (
    <div
      ref={containerRef}
      className="h-[450px] rounded-lg border border-[#e2e8f0]"
    />
  );
}
