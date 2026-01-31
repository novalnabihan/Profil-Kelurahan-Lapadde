// src/components/map/MapWithBoundary.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leaflet-config';
import { getGeoJsonCenter } from './geojson-utils';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  // Optional: untuk peta RT/RW
  type?: 'RW' | 'RT';
  // Optional: override icon (emoji) misalnya untuk kantor kelurahan
  icon?: string;
}

interface MapWithBoundaryProps {
  markers: MapMarker[];
  boundaryGeoJSON: any;
  center?: [number, number];
  zoom?: number;
  height?: string;
  onMarkerClick?: (id: string) => void;
}

export default function MapWithBoundary({
  markers,
  boundaryGeoJSON,
  center,
  zoom = 14,
  height = '450px',
  onMarkerClick,
}: MapWithBoundaryProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const calculateCenterFromMarkers = (
    points: MapMarker[]
  ): [number, number] => {
    if (!points.length) {
      return [-3.9857, 119.6693]; // fallback Lapadde
    }
    const lat =
      points.reduce((s, m) => s + m.lat, 0) / points.length;
    const lng =
      points.reduce((s, m) => s + m.lng, 0) / points.length;
    return [lat, lng];
  };

  // INIT MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // urutan preferensi center:
    // 1) props.center
    // 2) rata-rata marker
    // 3) center GeoJSON
    // 4) fallback default
    const geoCenter = getGeoJsonCenter(boundaryGeoJSON);
    const mapCenter =
      center ??
      (markers.length
        ? calculateCenterFromMarkers(markers)
        : geoCenter ?? [-3.9857, 119.6693]);

    const map = L.map(mapContainerRef.current).setView(
      mapCenter,
      zoom
    );
    mapRef.current = map;

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      }
    ).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    // Boundary: highlight area Lapadde (tanpa mask)
    if (boundaryGeoJSON) {
      const boundaryLayer = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#8b9474',
          weight: 2,
          opacity: 0.9,
          fillColor: '#8b9474',
          fillOpacity: 0.08,
        },
      }).addTo(map);

      const bounds = boundaryLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [120, 120],
          maxZoom: zoom, // misalnya 14
        });
      }
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundaryGeoJSON, zoom]);

  // UPDATE MARKERS
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const iconEmoji =
        marker.icon ??
        (marker.type === 'RW'
          ? '🏛️'
          : marker.type === 'RT'
          ? '🏘️'
          : '📍');

      const icon = L.divIcon({
        html: `<div style="font-size:24px">${iconEmoji}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const leafletMarker = L.marker(
        [marker.lat, marker.lng],
        { icon }
      ).bindPopup(
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
