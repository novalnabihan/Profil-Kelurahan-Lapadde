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
  color?: string;
}

interface MapWithBoundaryProps {
  markers: MapMarker[];
  boundaryGeoJSON: any;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showControls?: boolean;
}

export default function MapWithBoundary({
  markers,
  boundaryGeoJSON,
  center,
  zoom = 14,
  height = '500px',
  showControls = true,
}: MapWithBoundaryProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Calculate center from boundary if not provided
  const getMapCenter = (): [number, number] => {
    if (center) return center;
    
    // Calculate centroid from boundary
    if (boundaryGeoJSON?.features?.[0]?.geometry?.coordinates) {
      const coords = boundaryGeoJSON.features[0].geometry.coordinates[0];
      const lats = coords.map((c: number[]) => c[1]);
      const lngs = coords.map((c: number[]) => c[0]);
      const avgLat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;
      const avgLng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length;
      return [avgLat, avgLng];
    }
    
    return [1.1192, 104.0457]; // Default Batam
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
    
    // Add boundary
    if (boundaryGeoJSON) {
      boundaryLayerRef.current = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#8b9474',
          weight: 3,
          opacity: 0.8,
          fillColor: '#8b9474',
          fillOpacity: 0.1,
        },
      }).addTo(map);

      // Fit map to boundary
      const bounds = boundaryLayerRef.current.getBounds();
      map.fitBounds(bounds, { padding: [50, 50] });
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

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .bindPopup(
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