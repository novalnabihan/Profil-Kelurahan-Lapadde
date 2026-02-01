// src/components/map/MapWithBoundaryMask.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leaflet-config';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  icon: string;
}

interface MapWithBoundaryMaskProps {
  markers: MapMarker[];
  boundaryGeoJSON: any;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showControls?: boolean;
}

export default function MapWithBoundaryMask({
  markers,
  boundaryGeoJSON,
  center,
  zoom = 14,
  height = '500px',
  showControls = true,
}: MapWithBoundaryMaskProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const getMapCenter = (): [number, number] => {
    if (center) return center;

    if (boundaryGeoJSON?.features?.[0]?.geometry?.coordinates) {
      const coords = boundaryGeoJSON.features[0].geometry.coordinates;
      let allCoords: number[][] = [];

      if (boundaryGeoJSON.features[0].geometry.type === 'MultiPolygon') {
        coords[0][0].forEach((c: number[]) => allCoords.push(c));
      } else {
        coords[0].forEach((c: number[]) => allCoords.push(c));
      }

      const lats = allCoords.map((c) => c[1]);
      const lngs = allCoords.map((c) => c[0]);
      const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

      return [avgLat, avgLng];
    }

    return [-3.9857, 119.6693]; // Default Lapadde
  };

  // INIT MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapCenter = getMapCenter();
    const map = L.map(mapContainerRef.current, {
      zoomControl: showControls,
    }).setView(mapCenter, zoom);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    if (boundaryGeoJSON) {
      const boundaryLayer = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#8b9474',
          weight: 3,
          opacity: 0.9,
          fillColor: '#8b9474',
          fillOpacity: 0.05,
        },
      }).addTo(map);

      // Mask
      const coords = boundaryGeoJSON.features[0].geometry.coordinates;
      let boundaryCoords: [number, number][] = [];

      if (boundaryGeoJSON.features[0].geometry.type === 'MultiPolygon') {
        boundaryCoords = coords[0][0].map((c: number[]) => [c[1], c[0]] as [number, number]);
      } else {
        boundaryCoords = coords[0].map((c: number[]) => [c[1], c[0]] as [number, number]);
      }

      const worldBounds: [number, number][] = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180],
        [-90, -180],
      ];

      L.polygon([worldBounds, boundaryCoords], {
        color: 'transparent',
        fillColor: '#000000',
        fillOpacity: 0.4,
        interactive: false,
      }).addTo(map);

      const bounds = boundaryLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [boundaryGeoJSON, showControls, zoom]);

  // UPDATE MARKERS
  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) return;

    markerLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const icon = L.divIcon({
        html: `<div style="font-size:26px">${marker.icon}</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      L.marker([marker.lat, marker.lng], { icon }).bindPopup(
        `<div style="text-align:center;padding:8px;min-width:120px">
          <strong style="font-size:14px">${marker.title}</strong>
        </div>`,
        { closeButton: false },
      ).addTo(markerLayerRef.current!);
    });
  }, [markers]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-lg border border-[#e2e8f0]"
    />
  );
}
