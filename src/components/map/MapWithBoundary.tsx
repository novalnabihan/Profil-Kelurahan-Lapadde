
//src/components/map/MapWithBoundary.tsx
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
  subtitle?: string;
  type: 'RW' | 'RT';
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
  zoom = 15,
  height = '450px',
  onMarkerClick,
}: MapWithBoundaryProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const calculateCenter = (markers: MapMarker[]): [number, number] => {
    if (markers.length === 0) {
      // Calculate from boundary if no markers
      if (boundaryGeoJSON?.features?.[0]?.geometry?.coordinates) {
        const coords = boundaryGeoJSON.features[0].geometry.coordinates;
        // Handle MultiPolygon
        let allCoords: number[][] = [];
        
        if (boundaryGeoJSON.features[0].geometry.type === 'MultiPolygon') {
          // MultiPolygon has one more level of nesting
          coords[0][0].forEach((coord: number[]) => {
            allCoords.push(coord);
          });
        } else {
          // Regular Polygon
          coords[0].forEach((coord: number[]) => {
            allCoords.push(coord);
          });
        }

        const lats = allCoords.map(c => c[1]); // latitude is second
        const lngs = allCoords.map(c => c[0]); // longitude is first
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        
        return [avgLat, avgLng];
      }
      return [-3.9857, 119.6693]; // Default center Lapadde
    }

    const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
    const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;

    return [avgLat, avgLng];
  };

  // INIT MAP
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapCenter = center || calculateCenter(markers);

    const map = L.map(mapContainerRef.current).setView(mapCenter, zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);

    // Add boundary with proper coordinate handling
    if (boundaryGeoJSON) {
      const boundaryLayer = L.geoJSON(boundaryGeoJSON, {
        style: {
          color: '#8b9474',
          weight: 6,
          opacity: 0.8,
          fillColor: '#800080',
          fillOpacity: 0.1,
        },
        // Leaflet automatically handles coordinate conversion for GeoJSON
      }).addTo(map);

      // Fit map to boundary
      const bounds = boundaryLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [boundaryGeoJSON, zoom]);

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
  if (markers.length === 0) return [-3.9857, 119.6693];

  const lat = markers.reduce((s, m) => s + m.lat, 0) / markers.length;
  const lng = markers.reduce((s, m) => s + m.lng, 0) / markers.length;

  return [lat, lng];
}