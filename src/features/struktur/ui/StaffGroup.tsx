'use client';

import { useState } from 'react';
import type { OrgPerson } from '../types';
import OrgCard from './OrgCard';

interface StaffGroupProps {
  staff: OrgPerson[];
  label: string;
}

export default function StaffGroup({ staff, label }: StaffGroupProps) {
  const [open, setOpen] = useState(false);

  if (!staff.length) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8b9474] hover:text-[#6d7558]"
      >
        <span>{open ? 'Tutup' : 'Lihat'} Staf {label}</span>
        <span className="inline-flex items-center justify-center rounded-full bg-[#e2e8f0] text-[11px] px-1.5 py-0.5">
          {staff.length}
        </span>
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {staff.map((person) => (
            <OrgCard
              key={person.id}
              person={person}
              variant="staff"
              subtitle="Staf"
            />
          ))}
        </div>
      )}
    </div>
  );
}
