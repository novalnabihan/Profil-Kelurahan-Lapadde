import { FacilityCategory } from '../types';
import { FACILITY_ICONS, FACILITY_LABELS } from '../utils/facility-icons';

interface MapLegendProps {
  categories: FacilityCategory[];
}

export default function MapLegend({ categories }: MapLegendProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
      <h3 className="text-[16px] font-semibold text-[#1a202c] mb-4">
        Legenda Peta
      </h3>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-2">
            <span className="text-[22px]">{FACILITY_ICONS[category]}</span>
            <span className="text-[14px] text-[#4a5568]">
              {FACILITY_LABELS[category]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}