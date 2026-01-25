import { FacilityCategory } from '../types';

export const FACILITY_ICONS: Record<FacilityCategory, string> = {
  kantor: '🏛️',
  sekolah: '🏫',
  masjid: '🕌',
  puskesmas: '🏥',
  taman: '🌳',
  lapangan: '⚽',
  pasar: '🏪',
  posyandu: '👶',
  bank: '🏦',
};

export const FACILITY_LABELS: Record<FacilityCategory, string> = {
  kantor: 'Kantor',
  sekolah: 'Sekolah',
  masjid: 'Masjid',
  puskesmas: 'Puskesmas',
  taman: 'Taman',
  lapangan: 'Lapangan',
  pasar: 'Pasar',
  posyandu: 'Posyandu',
  bank: 'Bank',
};

export const FACILITY_COLORS: Record<FacilityCategory, string> = {
  kantor: '#8b9474',
  sekolah: '#4299e1',
  masjid: '#48bb78',
  puskesmas: '#ed8936',
  taman: '#38a169',
  lapangan: '#9f7aea',
  pasar: '#ed64a6',
  posyandu: '#f56565',
  bank: '#ecc94b',
};