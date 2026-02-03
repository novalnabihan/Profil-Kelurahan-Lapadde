// src/features/rt-rw/ui/RtCard.tsx
'use client';

import Image from 'next/image';
import { RtRwData } from '../types';
import DirectionButton from './DirectionButton';
import { openWhatsApp } from '../utils/phone';

interface RtCardProps {
  data: RtRwData;
  rwNumber?: string;
}

export default function RtCard({ data, rwNumber }: RtCardProps) {
  const handleCall = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (!data.phone) return;
    openWhatsApp(data.phone);
  };

  return (
    <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-[#f8f9fa] px-5 py-3 border-b border-[#e2e8f0]">
        <h3 className="text-[16px] font-semibold text-[#1a202c]">
          RT {data.number} {rwNumber && `• RW ${rwNumber}`}
        </h3>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Photo & Info */}
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 bg-[#e2e8f0] rounded-lg flex-shrink-0 overflow-hidden">
            {data.photoUrl ? (
              <Image
                src={data.photoUrl}
                alt={data.leader}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[28px]">
                👤
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#718096] font-medium mb-1">
              Ketua RT {data.number}
            </p>
            <h4 className="text-[15px] font-semibold text-[#1a202c] mb-2 truncate">
              {data.leader}
            </h4>

            {data.phone && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleCall}
                  className="flex items-center gap-1.5 text-[13px] text-[#8b9474] hover:text-[#6d7558] transition-colors"
                >
                  <span>📞</span>
                  <span className="font-medium">{data.phone}</span>
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-1.5 text-[13px] text-[#128C7E] hover:text-[#075E54] transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        {data.address && (
          <div className="mb-4 pb-4 border-b border-[#e2e8f0]">
            <p className="text-[13px] text-[#718096] mb-1">Alamat</p>
            <p className="text-[13px] text-[#4a5568] leading-relaxed">
              {data.address}
            </p>
          </div>
        )}

        {/* Direction Button */}
        {data.latitude && data.longitude && (
          <DirectionButton lat={data.latitude} lng={data.longitude} size="small" />
        )}
      </div>
    </div>
  );
}
