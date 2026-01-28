'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import RtRwDialog from './RtRwDialog'
import RtRwCard from './RtRwCard'
import { RtRwData } from '../types'

interface RtRwManagerProps {
  initialData: (RtRwData & { rtChildren?: RtRwData[] })[]
}

export default function RtRwManager({ initialData }: RtRwManagerProps) {
  const router = useRouter()
  const [rwData, setRwData] = useState(initialData)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'RW' | 'RT'>('RW')
  const [editingItem, setEditingItem] = useState<RtRwData | null>(null)
  const [selectedRwId, setSelectedRwId] = useState<string | null>(null)
  const [expandedRw, setExpandedRw] = useState<Set<string>>(new Set())

  const handleAddRw = () => {
    setDialogType('RW')
    setEditingItem(null)
    setSelectedRwId(null)
    setDialogOpen(true)
  }

  const handleAddRt = (rwId: string) => {
    setDialogType('RT')
    setEditingItem(null)
    setSelectedRwId(rwId)
    setDialogOpen(true)
  }

  const handleEdit = (item: RtRwData) => {
    setDialogType(item.type as 'RW' | 'RT')
    setEditingItem(item)
    setSelectedRwId(item.rwParentId || null)
    setDialogOpen(true)
  }

  const handleDelete = async (id: string, type: string) => {
    const confirmText = type === 'RW' 
      ? 'Hapus RW ini? Semua RT di dalamnya juga akan terhapus!'
      : 'Hapus RT ini?'
    
    if (!confirm(confirmText)) return

    try {
      const response = await fetch(`/api/rt-rw/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      router.refresh()
      window.location.reload()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gagal menghapus data')
    }
  }

  const handleSuccess = () => {
    setDialogOpen(false)
    setEditingItem(null)
    setSelectedRwId(null)
    router.refresh()
    window.location.reload()
  }

  const toggleExpand = (rwId: string) => {
    const newExpanded = new Set(expandedRw)
    if (newExpanded.has(rwId)) {
      newExpanded.delete(rwId)
    } else {
      newExpanded.add(rwId)
    }
    setExpandedRw(newExpanded)
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Daftar RW & RT</CardTitle>
          <Button onClick={handleAddRw} className="bg-[#8b9474] hover:bg-[#6d7558]">
            <Plus className="w-4 h-4 mr-2" />
            Tambah RW
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {rwData.length > 0 ? (
            rwData.map((rw) => {
              const isExpanded = expandedRw.has(rw.id)
              const rtList = rw.rtChildren || []

              return (
                <div key={rw.id} className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                  {/* RW Header */}
                  <div className="bg-[#f8f9fa] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(rw.id)}
                        className="p-1 h-auto"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </Button>
                      <div>
                        <h3 className="font-semibold text-[16px] text-[#1a202c]">
                          RW {rw.number}
                        </h3>
                        <p className="text-sm text-[#718096]">
                          {rw.leader} • {rtList.length} RT
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddRt(rw.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Tambah RT
                      </Button>
                    </div>
                  </div>

                  {/* RW Card */}
                  {isExpanded && (
                    <div className="p-4 bg-white border-b border-[#e2e8f0]">
                      <RtRwCard
                        data={rw}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}

                  {/* RT List */}
                  {isExpanded && rtList.length > 0 && (
                    <div className="p-4 bg-white">
                      <h4 className="text-sm font-medium text-[#718096] mb-3">
                        Daftar RT di RW {rw.number}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {rtList.map((rt) => (
                          <RtRwCard
                            key={rt.id}
                            data={rt}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isRt
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty RT State */}
                  {isExpanded && rtList.length === 0 && (
                    <div className="p-8 bg-white text-center">
                      <p className="text-[#718096] text-sm mb-3">
                        Belum ada RT di RW ini
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddRt(rw.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Tambah RT Pertama
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-[#718096] mb-4">Belum ada data RW</p>
              <Button onClick={handleAddRw} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Tambah RW Pertama
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <RtRwDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        editData={editingItem}
        rwParentId={selectedRwId}
        onSuccess={handleSuccess}
      />
    </>
  )
}