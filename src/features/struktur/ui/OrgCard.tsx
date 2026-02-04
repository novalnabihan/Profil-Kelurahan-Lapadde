'use client';

import Image from 'next/image';
import type { OrgPerson } from '../types';

type Variant = 'primary' | 'secondary' | 'staff' | 'external';

interface OrgCardProps {
  person: OrgPerson;
  variant?: Variant;
  subtitle?: string;
}

export default function OrgCard({
  person,
  variant = 'secondary',
  subtitle,
}: OrgCardProps) {
  const base =
    'rounded-xl border flex gap-3 p-3 sm:p-4 bg-white transition-shadow';
  const variantClass: Record<Variant, string> = {
    primary: 'border-[#8b9474] shadow-sm',
    secondary: 'border-[#e2e8f0]',
    staff: 'border-[#e2e8f0] bg-[#f8fafc]',
    external: 'border-[#ecc94b] bg-[#fffbeb]',
  };

  const titleClass: Record<Variant, string> = {
    primary: 'text-[15px] sm:text-[16px] font-semibold text-[#1a202c]',
    secondary: 'text-[14px] sm:text-[15px] font-semibold text-[#1a202c]',
    staff: 'text-[14px] font-semibold text-[#1a202c]',
    external: 'text-[14px] sm:text-[15px] font-semibold text-[#744210]',
  };

  return (
    <div className={`${base} ${variantClass[variant]}`}>
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#e2e8f0] overflow-hidden flex-shrink-0">
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt={person.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[24px]">
            👤
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {subtitle && (
          <p className="text-[11px] sm:text-[12px] uppercase tracking-wide text-[#a0aec0] mb-0.5">
            {subtitle}
          </p>
        )}
        <p className={titleClass[variant]}>{person.name}</p>
        <p className="text-[12px] sm:text-[13px] text-[#4a5568]">
          {person.position}
        </p>
        {person.nip && (
          <p className="mt-1 text-[11px] text-[#a0aec0]">NIP. {person.nip}</p>
        )}
      </div>
    </div>
  );
}
