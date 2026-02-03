// src/features/rt-rw/data/rw-boundaries.ts

// Boundary kelurahan (yang besar, buat page /rt-rw)
import kelurahanBoundary from '@/features/peta/data/boundary.json';

// Boundary per-RW
// Sesuaikan path/filename ini dengan file yang kamu punya
import rw01 from '../data/rw-01.json';
import rw02 from '../data/rw-02.json';
import rw03 from '../data/rw-03.json';
import rw04 from '../data/rw-04.json';
import rw05 from '../data/rw-05.json';
import rw06 from '../data/rw-06.json';
import rw07 from '../data/rw-07.json';
import rw08 from '../data/rw-08.json';
import rw09 from '../data/rw-09.json';
import rw10 from '../data/rw-10.json';

export const KELURAHAN_BOUNDARY = kelurahanBoundary as any;

export const RW_BOUNDARIES: Record<string, any> = {
  '01': rw01,
  '02': rw02,
  '03': rw03,
  '04': rw04,
  '05': rw05,
  '06': rw06,
  '07': rw07,
  '08': rw08,
  '09': rw09,
  '10': rw10,
};
