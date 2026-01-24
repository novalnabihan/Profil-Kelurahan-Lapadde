// src/features/rt-rw/ui/RwLeaderCard.tsx

'use client';

import Image from 'next/image';
import { RtRwData } from '../types';
import DirectionButton from './DirectionButton';

interface RwLeaderCardProps {
  data: RtRwData;
}

export default function RwLeaderCard({ data }: RwLeaderCardProps) {
  const handleCall = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  return (
    <div className="bg-white rounded-lg border-2 border-[#8b9474] overflow-hidden">
      {/* Header */}
      <div className="bg-[#8b9474] text-white px-6 py-4">
        <h3 className="text-[19px] font-semibold">Ketua RW {data.number}</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex gap-5 mb-5">
          <div className="w-24 h-24 bg-[#e2e8f0] rounded-lg flex-shrink-0 overflow-hidden">
            {data.photoUrl ? (
              <Image
                src={data.photoUrl}
                alt={data.leader}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[40px]">
                👤
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-[18px] font-semibold text-[#1a202c] mb-3">{data.leader}</h4>
            {data.phone && (
              <button
                onClick={handleCall}
                className="flex items-center gap-2 text-[15px] text-[#8b9474] hover:text-[#6d7558] transition-colors mb-2"
              >
                <span>📞</span>
                <span className="font-medium">{data.phone}</span>
              </button>
            )}
            {data.address && (
              <div className="flex items-start gap-2 text-[14px] text-[#4a5568]">
                <span>📍</span>
                <span className="leading-relaxed">{data.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Direction Button */}
        {data.latitude && data.longitude && (
          <DirectionButton lat={data.latitude} lng={data.longitude} />
        )}
      </div>
    </div>
  );
}