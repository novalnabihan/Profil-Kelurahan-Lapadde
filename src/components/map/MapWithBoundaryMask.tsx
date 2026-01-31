// src/components/map/MapWithBoundaryMask.tsx
'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/leaflet-config';
import {
  extractBoundaryRings,
  getGeoJsonCenter,
} from './geojson-utils';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  icon: string; // emoji / icon string
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

  // INIT MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const geoCenter = getGeoJsonCenter(boundaryGeoJSON);
    const mapCenter =
      center ?? geoCenter ?? [-3.9857, 119.6693];

    const map = L.map(mapContainerRef.current, {
      zoomControl: showControls,
    }).setView(mapCenter, zoom);

    mapRef.current = map;

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '© OpenStreetMap contributors',
      }
    ).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    if (boundaryGeoJSON) {
      // Lapisan boundary Lapadde
      const boundaryLayer = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#8b9474',
          weight: 3,
          opacity: 0.9,
          fillColor: '#8b9474',
          fillOpacity: 0.05,
        },
      }).addTo(map);

      // MASK: gelapkan area di luar boundary
      const boundaryRings = extractBoundaryRings(boundaryGeoJSON);

      // World bounds (lat, lng)
      const worldBounds: [number, number][] = [
        [-90, -180],
        [-90, 180],
        [90, 180],
        [90, -180],
        [-90, -180],
      ];

      // Polygon dengan hole:
      // outer = dunia, inner = semua ring boundary Lapadde
      L.polygon([worldBounds, ...boundaryRings], {
        color: 'transparent',
        fillColor: '#000000',
        fillOpacity: 0.4,
        interactive: false,
      }).addTo(map);

      // Fit ke boundary
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

      const leafletMarker = L.marker(
        [marker.lat, marker.lng],
        { icon }
      ).bindPopup(
        `<div style="text-align:center;padding:8px;min-width:120px">
          <strong style="font-size:14px">${marker.title}</strong>
        </div>`,
        { closeButton: false }
      );

      leafletMarker.addTo(markerLayerRef.current!);
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
