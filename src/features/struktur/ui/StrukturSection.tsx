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
    unit: p.unit ?? null,
    roleCategory: p.roleCategory ?? null,
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
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1a202c] mb-2">
            Struktur Organisasi
          </h2>
        </div>

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