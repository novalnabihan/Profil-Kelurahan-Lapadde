// src/components/map/geojson-utils.ts


export function getGeoJsonCenter(geojson: any): [number, number] | null {
  if (!geojson?.features?.length) return null;

  const geometry = geojson.features[0]?.geometry;
  if (!geometry || !geometry.coordinates) return null;

  const coords = geometry.coordinates;
  const all: number[][] = [];

  if (geometry.type === 'Polygon') {
    // Polygon: [ [ [lng, lat], ... ] ]
    coords.forEach((ring: number[][]) => {
      ring.forEach((c) => all.push(c));
    });
  } else if (geometry.type === 'MultiPolygon') {
    // MultiPolygon: [ [ [ [lng, lat], ... ] ], ... ]
    coords.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        ring.forEach((c) => all.push(c));
      });
    });
  } else {
    return null;
  }

  if (!all.length) return null;

  const lats = all.map((c) => c[1]);
  const lngs = all.map((c) => c[0]);

  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  return [avgLat, avgLng];
}

// Ambil semua ring boundary (outer + inner) sebagai array lat/lng
// Output: [ [ [lat,lng], ... ], ... ]
export function extractBoundaryRings(
  geojson: any
): [number, number][][] {
  const rings: [number, number][][] = [];

  if (!geojson?.features?.length) return rings;

  const geometry = geojson.features[0]?.geometry;
  if (!geometry || !geometry.coordinates) return rings;

  const coords = geometry.coordinates;

  if (geometry.type === 'Polygon') {
    coords.forEach((ring: number[][]) => {
      const latLngRing = ring.map(
        (c) => [c[1], c[0]] as [number, number]
      );
      rings.push(latLngRing);
    });
  } else if (geometry.type === 'MultiPolygon') {
    coords.forEach((polygon: number[][][]) => {
      polygon.forEach((ring: number[][]) => {
        const latLngRing = ring.map(
          (c) => [c[1], c[0]] as [number, number]
        );
        rings.push(latLngRing);
      });
    });
  }

  return rings;
}
