// src/features/rt-rw/types.ts

export interface RtRwData {
  id: string;
  type: 'RW' | 'RT';
  number: string;
  rwParentId?: string;
  leader: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  order: number;
}

export interface RwWithRts extends RtRwData {
  rtChildren?: RtRwData[];
}