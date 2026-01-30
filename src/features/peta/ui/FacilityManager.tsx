//src/features/peta/ui/FacilityManager.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Filter } from 'lucide-react'
import FacilityTable from './FacilityTable'
import FacilityDialog from './FacilityDialog'
import { Facility } from '@/generated/prisma'
import { FacilityCategory } from '../types'
import { FACILITY_LABELS } from '../utils/facility-icons'

interface FacilityManagerProps {
  initialData: Facility[]
}

export default function FacilityManager({ initialData }: FacilityManagerProps) {
  const router = useRouter()
  const [facilities, setFacilities] = useState(initialData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Facility | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const handleAdd = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleEdit = (item: Facility) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus fasilitas ini?')) return

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setFacilities((prev) => prev.filter((item) => item.id !== id))
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
    window.location.reload()
  }

  // Filter data
  const filteredData = filterCategory === 'all'
    ? facilities
    : facilities.filter((f) => f.category === filterCategory)

  // Get unique categories
  const categories = Array.from(new Set(facilities.map((f) => f.category)))

  // Count by category
  const categoryCounts = facilities.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterCategory('all')}>
          <CardContent className="p-4">
            <p className="text-sm text-[#718096] mb-1">Total Fasilitas</p>
            <p className="text-2xl font-bold text-[#1a202c]">{facilities.length}</p>
          </CardContent>
        </Card>
        {categories.slice(0, 3).map((cat) => (
          <Card
            key={cat}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setFilterCategory(cat)}
          >
            <CardContent className="p-4">
              <p className="text-sm text-[#718096] mb-1">
                {FACILITY_LABELS[cat as FacilityCategory] || cat}
              </p>
              <p className="text-2xl font-bold text-[#1a202c]">{categoryCounts[cat]}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar Fasilitas</CardTitle>
          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 text-sm border border-[#e2e8f0] rounded-md"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {FACILITY_LABELS[cat as FacilityCategory] || cat}
                </option>
              ))}
            </select>
            
            <Button onClick={handleAdd} className="bg-[#8b9474] hover:bg-[#6d7558]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Fasilitas
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <FacilityTable
              data={filteredData}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-[#718096] mb-4">
                {filterCategory === 'all' 
                  ? 'Belum ada data fasilitas'
                  : `Belum ada ${FACILITY_LABELS[filterCategory as FacilityCategory]}`
                }
              </p>
              <Button onClick={handleAdd} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Fasilitas
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <FacilityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editData={editingItem}
        onSuccess={handleSuccess}
      />
    </>
  )
}