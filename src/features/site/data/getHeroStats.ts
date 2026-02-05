// src/features/site/data/getHeroStats.ts
import prisma from '@/lib/prisma'
import { RoleCategory } from '@/generated/prisma'

export interface HeroStats {
  rwCount: number
  rtCount: number
  facilityCount: number
  staffCount: number
}

/**
 * Ambil data statistik untuk HeroSection.
 *
 * - rwCount      → jumlah RW (type = 'RW')
 * - rtCount      → jumlah RT (type = 'RT')
 * - facilityCount→ jumlah fasilitas (semua kategori)
 * - staffCount   → jumlah perangkat kelurahan
 *                  (MAIN + STAFF + yang roleCategory-nya null),
 *                  EXTERNAL (Babinsa, Bhabin, dll) tidak dihitung.
 */
export async function getHeroStats(): Promise<HeroStats> {
  const [rwCount, rtCount, facilityCount, staffCount] = await Promise.all([
    prisma.rtRw.count({
      where: { type: 'RW' },
    }),
    prisma.rtRw.count({
      where: { type: 'RT' },
    }),
    prisma.facility.count(),
    prisma.struktur.count({
      where: {
        // semua yang BUKAN EXTERNAL dihitung sebagai perangkat kelurahan
        roleCategory: {
          not: RoleCategory.EXTERNAL,
        },
      },
    }),
  ])

  return {
    rwCount,
    rtCount,
    facilityCount,
    staffCount,
  }
}
