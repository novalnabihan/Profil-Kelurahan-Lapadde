// src/features/struktur/ui/StrukturList.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import StrukturDialog from './StrukturDialog'
import StrukturTable from './StrukturTable'
import type { Struktur } from '@/generated/prisma'
import { cn } from '@/lib/utils'

interface StrukturListProps {
  initialData: Struktur[]
}

export default function StrukturList({ initialData }: StrukturListProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Struktur | null>(null)

  const handleAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: Struktur) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus anggota struktur ini?')) return

    try {
      const res = await fetch(`/api/struktur/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus data')
    }
  }

  const handleSuccess = () => {
    setDialogOpen(false)
    setEditingItem(null)
    router.refresh()
  }

  /**
   * ==========================
   * GROUPING LOGIC
   * roleCategory -> unit -> list
   * ==========================
   */
  const grouped = initialData.reduce<Record<string, Record<string, Struktur[]>>>(
    (acc, item) => {
      const role = item.roleCategory ?? 'LAINNYA'
      const unit = item.unit ?? 'UMUM'

      if (!acc[role]) acc[role] = {}
      if (!acc[role][unit]) acc[role][unit] = []

      acc[role][unit].push(item)
      return acc
    },
    {}
  )

  const roleEntries = Object.entries(grouped)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Daftar Struktur</CardTitle>
          <Button
            onClick={handleAdd}
            className="bg-[#8b9474] hover:bg-[#6d7558]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {roleEntries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#718096] mb-4">
                Belum ada data struktur organisasi
              </p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota Pertama
              </Button>
            </div>
          )}

          {roleEntries.map(([role, units]) => (
            <section key={role} className="space-y-4">
              {/* Role Header */}
              <div className="border-b border-[#e2e8f0] pb-2">
                <h3 className="text-[15px] font-semibold text-[#1a202c] uppercase tracking-wide">
                  {role.replaceAll('_', ' ')}
                </h3>
              </div>

              {/* Units */}
              <div className="space-y-6">
                {Object.entries(units).map(([unit, people]) => (
                  <div
                    key={unit}
                    className="rounded-lg border border-[#e2e8f0] bg-white"
                  >
                    <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#e2e8f0]">
                      <h4 className="text-[14px] font-medium text-[#4a5568]">
                        Unit: {unit.replaceAll('_', ' ')}
                      </h4>
                    </div>

                    <div className="p-4">
                      <StrukturTable
                        data={people}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </CardContent>
      </Card>

      {/* Dialog */}
      <StrukturDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editData={editingItem}
        onSuccess={handleSuccess}
      />
    </>
  )
}
