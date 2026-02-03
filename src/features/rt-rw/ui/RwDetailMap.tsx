// src/features/rt-rw/ui/RwDetailMap.tsx
'use client'

import MapWithBoundary from '@/components/map/MapWithBoundary'

type Marker = {
  id: string
  lat: number
  lng: number
  title: string
  subtitle?: string
  type?: 'RW' | 'RT'
  icon?: string
}

interface RwDetailMapProps {
  markers: Marker[]
  boundaryGeoJSON: any
  height?: string
  zoom?: number
}

export default function RwDetailMap({
  markers,
  boundaryGeoJSON,
  height = '450px',
  zoom = 15,
}: RwDetailMapProps) {
  return (
    <MapWithBoundary
      markers={markers}
      boundaryGeoJSON={boundaryGeoJSON}
      height={height}
      zoom={zoom}
    />
  )
}
