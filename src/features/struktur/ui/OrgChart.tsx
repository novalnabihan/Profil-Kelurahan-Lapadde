'use client';

import type { OrgPerson } from '../types';
import { splitStructure } from '../utils';
import OrgCard from './OrgCard';
import StaffGroup from './StaffGroup';

interface OrgChartProps {
  people: OrgPerson[];
}

export default function OrgChart({ people }: OrgChartProps) {
  const { lurah, seklur, kasi, pendukung, koordinatif } =
    splitStructure(people);

  return (
    <div className="space-y-10">
      {/* LURAH + KOORDINATIF */}
      <section>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)] items-stretch">
          {/* Koordinatif kiri (Babinsa / Bhabin) */}
          <div className="space-y-3 lg:self-center">
            {koordinatif.slice(0, 1).map((p) => (
              <OrgCard
                key={p.id}
                person={p}
                variant="external"
                subtitle="Mitra Koordinatif"
              />
            ))}
          </div>

          {/* Lurah di tengah */}
          <div className="space-y-4">
            {lurah && (
              <OrgCard
                person={lurah}
                variant="primary"
                subtitle="Lurah"
              />
            )}

            {seklur && (
              <div className="max-w-md mx-auto">
                <OrgCard
                  person={seklur}
                  variant="secondary"
                  subtitle="Sekretaris Lurah"
                />
              </div>
            )}
          </div>

          {/* Koordinatif kanan (kalau ada 2) */}
          <div className="space-y-3 lg:self-center">
            {koordinatif.slice(1).map((p) => (
              <OrgCard
                key={p.id}
                person={p}
                variant="external"
                subtitle="Mitra Koordinatif"
              />
            ))}
          </div>
        </div>
      </section>

      {/* KASI */}
      <section>
        <h3 className="text-[16px] font-semibold text-[#1a202c] mb-4">
          Kepala Seksi
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kasi.map(({ key, label, head, staff }) => (
            <div
              key={key}
              className="rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5"
            >
              {head ? (
                <OrgCard
                  person={head}
                  variant="secondary"
                  subtitle={label}
                />
              ) : (
                <p className="text-[13px] text-[#a0aec0]">
                  Belum ada data kepala seksi.
                </p>
              )}

              <StaffGroup staff={staff} label={label} />
            </div>
          ))}
        </div>
      </section>

      {/* UNIT PENDUKUNG (PLKB, Penyuluh, dll) */}
      {pendukung.length > 0 && (
        <section>
          <h3 className="text-[16px] font-semibold text-[#1a202c] mb-4">
            Unit Pendukung
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pendukung.map(({ label, person }) =>
              person ? (
                <OrgCard
                  key={person.id}
                  person={person}
                  variant="secondary"
                  subtitle={label}
                />
              ) : null
            )}
          </div>
        </section>
      )}
    </div>
  );
}
