'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2 } from 'lucide-react'
import type { Struktur, OrgUnit, RoleCategory } from '@/generated/prisma'

// 🔹 Label manusiawi untuk RoleCategory
function formatRoleCategory(role?: RoleCategory | null) {
  if (!role) return '-'
  switch (role) {
    case 'MAIN':
      return 'Inti Kelurahan'
    case 'STAFF':
      return 'Staf'
    case 'EXTERNAL':
      return 'Mitra Eksternal'
    default:
      return role
  }
}

// 🔹 Label manusiawi untuk OrgUnit
function formatOrgUnit(unit?: OrgUnit | null) {
  if (!unit) return '-'
  switch (unit) {
    case 'LURAH':
      return 'Lurah'
    case 'SEKLUR':
      return 'Sekretariat Kelurahan'
    case 'KASI_PEMERINTAHAN':
      return 'Kasi Pemerintahan & Trantib'
    case 'KASI_KESEJAHTERAAN':
      return 'Kasi Kesejahteraan Rakyat'
    case 'KASI_PELAYANAN_UMUM':
      return 'Kasi Pelayanan Umum & Pemberdayaan Masyarakat'
    case 'MITRA_EKSTERNAL':
      return 'Mitra Eksternal'
    default:
      return unit
  }
}

interface StrukturTableProps {
  data: Struktur[]
  onEdit: (item: Struktur) => void
  onDelete: (id: string) => void
}

export default function StrukturTable({ data, onEdit, onDelete }: StrukturTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[70px]">Urut</TableHead>
            <TableHead className="w-[90px]">Foto</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead className="w-[170px]">Unit</TableHead>
            <TableHead className="w-[140px]">Kategori</TableHead>
            <TableHead className="w-[120px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {/* Order */}
              <TableCell className="font-medium text-[#4a5568]">
                {item.order}
              </TableCell>

              {/* Foto */}
              <TableCell>
                <div className="w-14 h-14 bg-[#e2e8f0] rounded-lg overflow-hidden">
                  {item.photoUrl ? (
                    <Image
                      src={item.photoUrl}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      👤
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Nama */}
              <TableCell className="font-medium text-[#1a202c]">
                {item.name}
              </TableCell>

              {/* Jabatan */}
              <TableCell className="text-[#4a5568]">
                {item.position}
              </TableCell>

              {/* Unit */}
              <TableCell>
                <Badge variant="outline" className="border-[#cbd5e0] text-[#4a5568] bg-[#f7fafc]">
                  {formatOrgUnit(item.unit as OrgUnit | null)}
                </Badge>
              </TableCell>

              {/* Kategori Peran */}
              <TableCell>
                <Badge
                  className={
                    item.roleCategory === 'MAIN'
                      ? 'bg-[#8b9474] text-white hover:bg-[#6d7558]'
                      : item.roleCategory === 'STAFF'
                      ? 'bg-[#edf2f7] text-[#4a5568] hover:bg-[#e2e8f0]'
                      : 'bg-[#ebf8ff] text-[#2b6cb0] hover:bg-[#bee3f8]'
                  }
                >
                  {formatRoleCategory(item.roleCategory as RoleCategory | null)}
                </Badge>
              </TableCell>

              {/* Aksi */}
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

          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-[#718096]">
                Belum ada data struktur. Tambahkan anggota pertama melalui tombol
                <span className="font-semibold"> “Tambah Anggota”</span>.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
