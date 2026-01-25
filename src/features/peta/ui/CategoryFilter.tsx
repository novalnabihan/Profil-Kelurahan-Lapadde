'use client';

import { FacilityCategory } from '../types';
import { FACILITY_ICONS, FACILITY_LABELS } from '../utils/facility-icons';

interface CategoryFilterProps {
  categories: FacilityCategory[];
  activeCategories: FacilityCategory[];
  onChange: (categories: FacilityCategory[]) => void;
}

export default function CategoryFilter({
  categories,
  activeCategories,
  onChange,
}: CategoryFilterProps) {
  const toggleCategory = (category: FacilityCategory) => {
    if (activeCategories.includes(category)) {
      onChange(activeCategories.filter((c) => c !== category));
    } else {
      onChange([...activeCategories, category]);
    }
  };

  const toggleAll = () => {
    if (activeCategories.length === categories.length) {
      onChange([]);
    } else {
      onChange(categories);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-[#1a202c]">Filter Lokasi</h3>
        <button
          onClick={toggleAll}
          className="text-[13px] text-[#8b9474] hover:text-[#6d7558] font-medium"
        >
          {activeCategories.length === categories.length ? 'Sembunyikan Semua' : 'Tampilkan Semua'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[#8b9474] text-white'
                  : 'bg-[#f8f9fa] text-[#4a5568] hover:bg-[#e2e8f0]'
              }`}
            >
              <span className="text-[16px]">{FACILITY_ICONS[category]}</span>
              <span>{FACILITY_LABELS[category]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}