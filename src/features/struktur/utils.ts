// src/features/struktur/utils.ts
import type { OrgPerson } from './types'
import type { OrgUnit, RoleCategory } from '@/generated/prisma'

type KasiBlock = {
  key: string
  label: string
  head?: OrgPerson
  staff: OrgPerson[]
}

type PendukungBlock = {
  label: string
  person: OrgPerson
}

const norm = (s?: string | null) => (s ?? '').toLowerCase()

export function splitStructure(people: OrgPerson[]) {
  // --- LURAH ---
  const lurah =
    people.find(
      (p) =>
        p.unit === 'LURAH' ||
        norm(p.position).includes('lurah')
    ) ?? null

  // --- SEKRETARIS LURAH ---
  const seklur =
    people.find(
      (p) =>
        p.unit === 'SEKLUR' ||
        norm(p.position).includes('sekretaris lurah') ||
        norm(p.position).includes('sekretaris kelurahan') ||
        norm(p.position).includes('seklur')
    ) ?? null

  // --- DEFINISI KASI (3 kotak seksi) ---
  const seksiDefs: { key: string; label: string; unit: OrgUnit }[] = [
    {
      key: 'KASI_PEMERINTAHAN',
      label: 'Kasi Pemerintahan & Trantib',
      unit: 'KASI_PEMERINTAHAN',
    },
    {
      key: 'KASI_KESEJAHTERAAN',
      label: 'Kasi Kesejahteraan Rakyat',
      unit: 'KASI_KESEJAHTERAAN',
    },
    {
      key: 'KASI_PELAYANAN_UMUM',
      label: 'Kasi Pelayanan Umum & Pemberdayaan Masyarakat',
      unit: 'KASI_PELAYANAN_UMUM',
    },
  ]

  const kasi: KasiBlock[] = seksiDefs.map((def) => {
    // kepala seksi: unit = X + roleCategory MAIN (ideal),
    // atau fallback kalau diisi manual pakai teks "kasi"
    const head =
      people.find(
        (p) =>
          p.unit === def.unit &&
          (p.roleCategory === 'MAIN' ||
            norm(p.position).includes('kasi'))
      ) ?? undefined

    // staf seksi: unit = X + roleCategory STAFF
    const staff = people.filter(
      (p) => p.unit === def.unit && p.roleCategory === 'STAFF'
    )

    return {
      key: def.key,
      label: def.label,
      head,
      staff,
    }
  })

  // --- MITRA EKSTERNAL ---
  const eksternal = people.filter(
    (p) =>
      p.roleCategory === 'EXTERNAL' ||
      p.unit === 'MITRA_EKSTERNAL'
  )

  const isKoordinatif = (p: OrgPerson) => {
    const pos = norm(p.position)
    return (
      pos.includes('babinsa') ||
      pos.includes('bhabin') ||
      pos.includes('bhabinkamtibmas')
    )
  }

  const isPLKB = (p: OrgPerson) => norm(p.position).includes('plkb')

  const isPenyuluh = (p: OrgPerson) =>
    norm(p.position).includes('penyuluh')

  // Babinsa + Bhabinkamtibmas → sisi kiri/kanan Lurah
  const koordinatif = eksternal.filter(isKoordinatif)

  // Unit pendukung: PLKB, Penyuluh, dan sisanya kalau ada
  const pendukungRaw: PendukungBlock[] = []

  const plkb = eksternal.find(isPLKB)
  if (plkb) pendukungRaw.push({ label: 'PLKB', person: plkb })

  const penyuluh = eksternal.find(isPenyuluh)
  if (penyuluh)
    pendukungRaw.push({
      label: 'Penyuluh Pertanian',
      person: penyuluh,
    })

  // eksternal lain yang bukan babinsa/bhabin/plkb/penyuluh
  eksternal
    .filter(
      (p) =>
        !isKoordinatif(p) && !isPLKB(p) && !isPenyuluh(p)
    )
    .forEach((p) => {
      pendukungRaw.push({
        label: 'Mitra Eksternal',
        person: p,
      })
    })

  // hapus duplikat by id biar nggak dobel kalau nyangkut di dua kategori
  const seen = new Set<string>()
  const pendukung = pendukungRaw.filter((blk) => {
    if (seen.has(blk.person.id)) return false
    seen.add(blk.person.id)
    return true
  })

  return {
    lurah,
    seklur,
    kasi,
    koordinatif,
    pendukung,
  }
}
