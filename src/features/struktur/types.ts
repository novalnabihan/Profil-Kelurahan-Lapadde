// src/features/struktur/types.ts
import type { OrgUnit as PrismaOrgUnit, RoleCategory as PrismaRoleCategory } from '@/generated/prisma/'

// Re-export biar FE pakai enum dari Prisma, bukan bikin sendiri
export type OrgUnit = PrismaOrgUnit
export type RoleCategory = PrismaRoleCategory

export interface OrgPerson {
  id: string
  name: string
  position: string

  // 🔥 Penting: nullable, karena di schema Prisma: unit & roleCategory itu opsional
  unit: OrgUnit | null
  roleCategory: RoleCategory | null

  nip: string | null
  phone: string | null

  // boleh null / undefined, supaya fleksibel
  photoUrl?: string | null

  order: number
}
