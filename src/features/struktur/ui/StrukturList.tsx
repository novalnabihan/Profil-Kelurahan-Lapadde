'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import StrukturTable from './StrukturTable'
import StrukturDialog from './StrukturDialog'
import { Struktur } from '@/generated/prisma'

interface StrukturListProps {
  initialData: Struktur[]
}

export default function StrukturList({ initialData }: StrukturListProps) {
  const router = useRouter()
  const [struktur, setStruktur] = useState(initialData)
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
      const response = await fetch(`/api/struktur/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      // Update local state
      setStruktur((prev) => prev.filter((item) => item.id !== id))
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gagal menghapus data')
    }
  }

  const handleSuccess = () => {
    setDialogOpen(false)
    setEditingItem(null)
    router.refresh()
    // Refresh data
    window.location.reload()
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Anggota</CardTitle>
          <Button onClick={handleAdd} className="bg-[#8b9474] hover:bg-[#6d7558]">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Anggota
          </Button>
        </CardHeader>
        <CardContent>
          {struktur.length > 0 ? (
            <StrukturTable
              data={struktur}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#718096] mb-4">Belum ada data struktur</p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota Pertama
              </Button>
            </div>
          )}
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