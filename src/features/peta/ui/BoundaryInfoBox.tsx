import { BoundaryInfo } from '../types';

interface BoundaryInfoBoxProps {
  info: BoundaryInfo;
}

export default function BoundaryInfoBox({ info }: BoundaryInfoBoxProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] p-6">
      <h3 className="text-[16px] font-semibold text-[#1a202c] mb-4">
        Batas Wilayah Kelurahan
      </h3>
      <div className="space-y-2.5 text-[14px]">
        <div className="flex gap-3">
          <span className="text-[#718096] min-w-[80px]">Utara</span>
          <span className="text-[#2d3748] font-medium">: {info.north}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-[#718096] min-w-[80px]">Selatan</span>
          <span className="text-[#2d3748] font-medium">: {info.south}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-[#718096] min-w-[80px]">Barat</span>
          <span className="text-[#2d3748] font-medium">: {info.west}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-[#718096] min-w-[80px]">Timur</span>
          <span className="text-[#2d3748] font-medium">: {info.east}</span>
        </div>
        <div className="flex gap-3 pt-2 border-t border-[#e2e8f0] mt-3">
          <span className="text-[#718096] min-w-[80px]">Luas Wilayah</span>
          <span className="text-[#2d3748] font-semibold">: {info.area}</span>
        </div>
      </div>
    </div>
  );
}