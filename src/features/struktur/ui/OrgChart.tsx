//src/features/struktur/ui/OrgChart.tsx

'use client';

import { useState } from 'react';
import type { OrgPerson } from '../types';
import { splitStructure } from '../utils';
import OrgCard from './OrgCard';

interface OrgChartProps {
  people: OrgPerson[];
}

export default function OrgChart({ people }: OrgChartProps) {
  const { lurah, seklur, kasi, pendukung, koordinatif } = splitStructure(people);
  
  // State untuk tracking kasi mana yang sedang dibuka staffnya
  const [openKasiId, setOpenKasiId] = useState<string | null>(null);

  const toggleKasiStaff = (kasiId: string | null) => {
    setOpenKasiId(openKasiId === kasiId ? null : kasiId);
  };

  // Helper untuk get seklur staff dengan type safety
  const seklurGroup = kasi.find(k => k.key === 'seklur');
  const seklurStaff = seklurGroup?.staff ?? [];

  return (
    <div className="space-y-12">
      {/* 1. LURAH - di tengah */}
      {lurah && (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <OrgCard person={lurah} variant="primary" />
          </div>
        </div>
      )}

      {/* 2. SEKRETARIS LURAH - di tengah, dengan staff jika ada */}
      <div className='mt-4'>
      {seklur && (
        <div className="space-y-5">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <OrgCard
                person={seklur}
                variant="secondary"
                hasStaff={seklurStaff.length > 0}
                isExpanded={openKasiId === 'seklur'}
                onClick={
                  seklurStaff.length > 0
                    ? () => toggleKasiStaff('seklur')
                    : undefined
                }
              />
            </div>
          </div>

          {/* Staff Sekretaris Lurah */}
          {openKasiId === 'seklur' && seklurStaff.length > 0 && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[14px] sm:text-[15px] font-semibold text-[#1a202c]">
                    Staf Sekretaris Lurah
                  </h4>
                  <button
                    onClick={() => setOpenKasiId(null)}
                    className="text-[12px] sm:text-[13px] text-[#718096] hover:text-[#1a202c]"
                  >
                    Tutup ✕
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {seklurStaff.map((person) => (
                    <OrgCard key={person.id} person={person} variant="staff" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* 3. KEPALA SEKSI - 3 kolom */}
      <div className="mt-6">
        <h3 className="text-[18px] sm:text-[17px] font-semibold text-[#1a202c] mb-6 text-center">
          Kepala Seksi
        </h3>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 items-start">
          {kasi
            .filter(k => k.key !== 'seklur') // exclude seklur dari sini
            .map(({ key, label, head, staff }) => (
              <div key={key} className="space-y-4">
                {/* Kasi Card */}
                {head ? (
                  <OrgCard
                    person={head}
                    variant="secondary"
                    hasStaff={staff.length > 0}
                    isExpanded={openKasiId === key}
                    onClick={staff.length > 0 ? () => toggleKasiStaff(key) : undefined}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-[#e2e8f0] bg-white p-6 text-center">
                    <p className="text-[13px] text-[#a0aec0]">Belum ada data</p>
                  </div>
                )}

                {/* Staff untuk kasi ini */}
                {openKasiId === key && staff.length > 0 && (
                  <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-[13px] sm:text-[14px] font-semibold text-[#1a202c]">
                        Staf {label}
                      </h4>
                      <button
                        onClick={() => setOpenKasiId(null)}
                        className="text-[11px] sm:text-[12px] text-[#718096] hover:text-[#1a202c]"
                      >
                        Tutup ✕
                      </button>
                    </div>
                    <div className="space-y-2">
                      {staff.map((person) => (
                        <OrgCard key={person.id} person={person} variant="staff" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* 4. UNIT PENDUKUNG - 4 kolom di bawah */}
      {pendukung.length > 0 && (
        <div className="mt-6">
          <h3 className="text-[18px] sm:text-[17px] font-semibold text-[#1a202c] mb-6 text-center">
            Unit Pendukung
          </h3>
          <div className="grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {pendukung.map(({ label, person }) =>
              person ? (
                <OrgCard
                  key={person.id}
                  person={person}
                  variant="external"
                />
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}