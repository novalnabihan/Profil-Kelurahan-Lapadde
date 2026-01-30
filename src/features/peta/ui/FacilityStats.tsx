//src/features/peta/ui/FacilityStats.tsx

import { Facility, FacilityCategory } from '../types';
import { FACILITY_ICONS, FACILITY_LABELS } from '../utils/facility-icons';

interface FacilityStatsProps {
  facilities: Facility[];
}

export default function FacilityStats({ facilities }: FacilityStatsProps) {
  // Count by category
  const counts = facilities.reduce((acc, facility) => {
    acc[facility.category] = (acc[facility.category] || 0) + 1;
    return acc;
  }, {} as Record<FacilityCategory, number>);

  // Get unique categories
  const categories = Object.keys(counts) as FacilityCategory[];

  return (
    <div>
      <h3 className="text-[18px] font-semibold text-[#1a202c] mb-5">
        Sarana & Prasarana
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category}
            className="bg-white rounded-lg border border-[#e2e8f0] p-5 text-center hover:shadow-md transition-shadow"
          >
            <div className="text-[36px] mb-2">{FACILITY_ICONS[category]}</div>
            <div className="text-[28px] font-bold text-[#8b9474] mb-1">
              {counts[category]}
            </div>
            <div className="text-[13px] text-[#718096] font-medium">
              {FACILITY_LABELS[category]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}