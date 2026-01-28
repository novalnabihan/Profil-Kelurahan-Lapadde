'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, MapPin } from 'lucide-react'
import { RtRwData } from '../types'

interface RtRwCardProps {
  data: RtRwData
  onEdit: (item: RtRwData) => void
  onDelete: (id: string, type: string) => void
  isRt?: boolean
}

export default function RtRwCard({ data, onEdit, onDelete, isRt }: RtRwCardProps) {
  return (
    <div className="border border-[#e2e8f0] rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Photo */}
        <div className="w-20 h-20 bg-[#e2e8f0] rounded-lg overflow-hidden flex-shrink-0">
          {data.photoUrl ? (
            <Image
              src={data.photoUrl}
              alt={data.leader}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              👤
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-[#1a202c] text-[15px]">
                {isRt ? `RT ${data.number}` : `Ketua RW ${data.number}`}
              </h4>
              <p className="text-[14px] text-[#4a5568] font-medium">{data.leader}</p>
            </div>
          </div>

          {/* Contact */}
          {data.phone && (
            <p className="text-[13px] text-[#718096] mb-1 flex items-center gap-1">
              <span>📞</span>
              <span>{data.phone}</span>
            </p>
          )}

          {/* Address */}
          {data.address && (
            <p className="text-[13px] text-[#718096] mb-2 flex items-start gap-1">
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{data.address}</span>
            </p>
          )}

          {/* Coordinates */}
          {data.latitude && data.longitude && (
            <p className="text-[12px] text-[#a0aec0] mb-3">
              📍 {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(data)}
              className="flex-1"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(data.id, data.type)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}