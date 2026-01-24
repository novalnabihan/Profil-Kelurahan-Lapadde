// src/components/map/LeafletMap.tsx

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../lib/leaflet-config';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: 'RW' | 'RT';
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (id: string) => void;
}

export default function LeafletMap({
  markers,
  center,
  zoom = 15,
  height = '450px',
  onMarkerClick,
}: LeafletMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // INIT MAP (once)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapCenter = center || calculateCenter(markers);

    const map = L.map(mapContainerRef.current).setView(mapCenter, zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // UPDATE MARKERS
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const icon = L.divIcon({
        html: `<div style="font-size:24px">${
          marker.type === 'RW' ? '🏛️' : '🏘️'
        }</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon }).bindPopup(
        `
        <div style="text-align:center;padding:6px">
          <strong>${marker.title}</strong><br/>
          <small>${marker.subtitle ?? ''}</small>
        </div>
        `,
        { closeButton: false }
      );

      leafletMarker.on('click', () => {
        onMarkerClick?.(marker.id);
        leafletMarker.openPopup();
      });

      leafletMarker.addTo(markerLayerRef.current!);
    });
  }, [markers, onMarkerClick]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-lg border border-[#e2e8f0]"
    />
  );
}

function calculateCenter(markers: MapMarker[]): [number, number] {
  if (markers.length === 0) return [1.1192, 104.0457];

  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;

  return [lat, lng];
}
