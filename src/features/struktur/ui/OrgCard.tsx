//src/features/struktur/ui/OrgCard.tsx

'use client';

import Image from 'next/image';
import type { OrgPerson } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'staff' | 'external';

interface OrgCardProps {
  person: OrgPerson;
  variant?: Variant;
  subtitle?: string;
  onClick?: () => void;
  hasStaff?: boolean;
  isExpanded?: boolean;
}

export default function OrgCard({
  person,
  variant = 'secondary',
  subtitle,
  onClick,
  hasStaff = false,
  isExpanded = false,
}: OrgCardProps) {
  const base =
    'rounded-xl border flex items-center gap-4 p-4 bg-white transition-all';
  
  const variantClass: Record<Variant, string> = {
    primary: 'border-[#8b9474] shadow-md hover:shadow-lg',
    secondary: 'border-[#e2e8f0] shadow-sm hover:shadow-md',
    staff: 'border-[#e2e8f0] bg-[#f8fafc]',
    external: 'border-[#cbd5e0] bg-white shadow-sm',
  };

  const clickableClass = onClick || hasStaff ? 'cursor-pointer hover:border-[#8b9474]' : '';

  return (
    <div 
      className={`${base} ${variantClass[variant]} ${clickableClass}`}
      onClick={onClick}
    >
      {/* Photo */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-[#e2e8f0] overflow-hidden flex-shrink-0">
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt={person.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[32px] sm:text-[40px] text-[#a0aec0]">
            👤
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <p className="text-[15px] sm:text-[17px] font-semibold text-[#1a202c] mb-1 truncate">
          {person.name}
        </p>
        <p className="text-[13px] sm:text-[14px] text-[#4a5568] line-clamp-2">
          {person.position}
        </p>
      </div>

      {/* Chevron icon for expandable cards */}
      {hasStaff && (
        <div className="flex-shrink-0 text-[#8b9474]">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      )}
    </div>
  );
}