// src/features/struktur/ui/StrukturSection.tsx

import prisma from '@/lib/prisma'
import OrgChart from './OrgChart'
import type { OrgPerson } from '../types'

export default async function StrukturSection() {
  const people = await prisma.struktur.findMany({
    orderBy: [
      { roleCategory: 'asc' },
      { unit: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  })

  const orgPeople: OrgPerson[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    position: p.position,
    unit: p.unit ?? null,              // ✅ OrgUnit | null
    roleCategory: p.roleCategory ?? null, // ✅ RoleCategory | null
    nip: p.nip ?? null,
    phone: p.phone ?? null,
    photoUrl: p.photoUrl ?? null,
    order: p.order,
  }))

  return (
    <section
      id="struktur"
      className="py-12 sm:py-16 bg-[#f8f9fa] border-t border-[#e2e8f0]"
    >
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[22px] sm:text-[24px] font-semibold text-[#1a202c] mb-2">
          Struktur Organisasi
        </h2>
        <p className="text-[14px] sm:text-[15px] text-[#718096] mb-8 max-w-2xl">
          Susunan Lurah, Sekretaris Lurah, Kepala Seksi, serta staf dan unit
          pendukung di Kelurahan Lapadde.
        </p>

        {orgPeople.length === 0 ? (
          <div className="bg-white border border-dashed border-[#e2e8f0] rounded-lg p-8 text-center">
            <p className="text-[14px] text-[#718096]">
              Data struktur organisasi belum diisi. Silakan tambahkan data melalui panel admin.
            </p>
          </div>
        ) : (
          <OrgChart people={orgPeople} />
        )}
      </div>
    </section>
  )
}
