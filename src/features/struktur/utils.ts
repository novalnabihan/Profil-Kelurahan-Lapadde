// src/features/struktur/utils.ts

import type { OrgPerson, KasiGroup } from './types';

export function splitStructure(people: OrgPerson[]) {
  // 1. LURAH
  const lurah = people.find((p) => p.unit === 'LURAH' && p.roleCategory === 'MAIN') ?? null;

  // 2. SEKRETARIS LURAH
  const seklur = people.find((p) => p.unit === 'SEKLUR' && p.roleCategory === 'MAIN') ?? null;

  // 3. STAFF SEKRETARIS LURAH
  const seklurStaff = people.filter((p) => p.unit === 'SEKLUR' && p.roleCategory === 'STAFF');

  // 4. KASI PEMERINTAHAN
  const kasiPemerintahan = people.find(
    (p) => p.unit === 'KASI_PEMERINTAHAN' && p.roleCategory === 'MAIN'
  ) ?? null;
  const kasiPemerintahanStaff = people.filter(
    (p) => p.unit === 'KASI_PEMERINTAHAN' && p.roleCategory === 'STAFF'
  );

  // 5. KASI KESEJAHTERAAN
  const kasiKesejahteraan = people.find(
    (p) => p.unit === 'KASI_KESEJAHTERAAN' && p.roleCategory === 'MAIN'
  ) ?? null;
  const kasiKesejahteraanStaff = people.filter(
    (p) => p.unit === 'KASI_KESEJAHTERAAN' && p.roleCategory === 'STAFF'
  );

  // 6. KASI PELAYANAN UMUM
  const kasiPelayanan = people.find(
    (p) => p.unit === 'KASI_PELAYANAN_UMUM' && p.roleCategory === 'MAIN'
  ) ?? null;
  const kasiPelayananStaff = people.filter(
    (p) => p.unit === 'KASI_PELAYANAN_UMUM' && p.roleCategory === 'STAFF'
  );

  // 7. MITRA EKSTERNAL / UNIT PENDUKUNG
  const mitraEksternal = people.filter((p) => p.unit === 'MITRA_EKSTERNAL');

  // Kelompokkan Kasi
  const kasi: KasiGroup[] = [
    {
      key: 'seklur',
      label: 'Sekretaris Lurah',
      head: seklur,
      staff: seklurStaff,
    },
    {
      key: 'pemerintahan',
      label: 'Kasi Pemerintahan & Trantib',
      head: kasiPemerintahan,
      staff: kasiPemerintahanStaff,
    },
    {
      key: 'kesejahteraan',
      label: 'Kasi Kesejahteraan Rakyat',
      head: kasiKesejahteraan,
      staff: kasiKesejahteraanStaff,
    },
    {
      key: 'pelayanan',
      label: 'Kasi Pelayanan Umum & Pemberdayaan Masyarakat',
      head: kasiPelayanan,
      staff: kasiPelayananStaff,
    },
  ];

  // Unit Pendukung - berdasarkan jabatan/position
  const pendukung = [
    { label: 'PLKB', person: mitraEksternal.find(p => p.position.toLowerCase().includes('plkb')) ?? null },
    { label: 'Penyuluh Pertanian', person: mitraEksternal.find(p => p.position.toLowerCase().includes('penyuluh')) ?? null },
    { label: 'Babinsa', person: mitraEksternal.find(p => p.position.toLowerCase().includes('babinsa')) ?? null },
    { label: 'Babinkamtibmas', person: mitraEksternal.find(p => p.position.toLowerCase().includes('bhabin') || p.position.toLowerCase().includes('kamtib')) ?? null },
  ].filter(item => item.person !== null);

  // Koordinatif (jika masih ingin digunakan)
  const koordinatif = mitraEksternal.filter(p => 
    p.position.toLowerCase().includes('babinsa') || 
    p.position.toLowerCase().includes('bhabin') ||
    p.position.toLowerCase().includes('kamtib')
  );

  return {
    lurah,
    seklur,
    kasi,
    pendukung,
    koordinatif,
  };
}