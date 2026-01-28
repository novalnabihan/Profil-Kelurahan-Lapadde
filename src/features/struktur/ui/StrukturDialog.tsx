'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { Struktur } from '@/generated/prisma'

interface StrukturDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editData?: Struktur | null
  onSuccess: () => void
}

export default function StrukturDialog({
  open,
  onOpenChange,
  editData,
  onSuccess,
}: StrukturDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [order, setOrder] = useState(0)

  // Reset form when dialog opens/closes or editData changes
  useEffect(() => {
    if (open) {
      if (editData) {
        setName(editData.name)
        setPosition(editData.position)
        setPhotoUrl(editData.photoUrl || '')
        setOrder(editData.order)
      } else {
        setName('')
        setPosition('')
        setPhotoUrl('')
        setOrder(0)
      }
    }
  }, [open, editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editData
        ? `/api/struktur/${editData.id}`
        : '/api/struktur'

      const method = editData ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          position,
          photoUrl: photoUrl || null,
          order: Number(order),
        }),
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      onSuccess()
    } catch (error) {
      console.error('Save error:', error)
      alert('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </DialogTitle>
          <DialogDescription>
            {editData
              ? 'Perbarui informasi anggota struktur organisasi'
              : 'Tambahkan anggota baru ke struktur organisasi'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Drs. Ahmad Santoso, M.Si"
              required
            />
          </div>

          {/* Posisi */}
          <div className="space-y-2">
            <Label htmlFor="position">Posisi/Jabatan</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Contoh: Lurah"
              required
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">Urutan</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              placeholder="0"
              required
              min="0"
            />
            <p className="text-xs text-[#718096]">
              Urutan tampilan (0 = paling atas, dst)
            </p>
          </div>

          {/* Photo */}
          <div className="space-y-2">
            <ImageUpload
              value={photoUrl}
              onChange={setPhotoUrl}
              folder="struktur"
              label="Foto"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#8b9474] hover:bg-[#6d7558]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}