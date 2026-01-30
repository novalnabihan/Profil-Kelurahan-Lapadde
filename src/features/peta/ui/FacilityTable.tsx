//src/features/peta/ui/FacilityTable.tsx

'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Pencil, Trash2, MapPin } from 'lucide-react'
import { Facility } from '@/generated/prisma'
import { FacilityCategory } from '../types'
import { FACILITY_ICONS, FACILITY_LABELS } from '../utils/facility-icons'

interface FacilityTableProps {
  data: Facility[]
  onEdit: (item: Facility) => void
  onDelete: (id: string) => void
}

export default function FacilityTable({ data, onEdit, onDelete }: FacilityTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Icon</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Alamat</TableHead>
            <TableHead className="w-[180px]">Koordinat</TableHead>
            <TableHead className="w-[120px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-2xl">
                {FACILITY_ICONS[item.category as FacilityCategory] || '📍'}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#f8f9fa] text-xs font-medium text-[#4a5568]">
                  {FACILITY_LABELS[item.category as FacilityCategory] || item.category}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {item.address || '-'}
              </TableCell>
              <TableCell className="text-xs text-[#718096]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}