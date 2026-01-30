//src/features/peta/types.ts

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  address?: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export type FacilityCategory = 
  | 'kantor'
  | 'sekolah'
  | 'masjid'
  | 'puskesmas'
  | 'taman'
  | 'lapangan'
  | 'pasar'
  | 'posyandu'
  | 'bank';

export interface BoundaryInfo {
  north: string;
  south: string;
  east: string;
  west: string;
  area: string;
}