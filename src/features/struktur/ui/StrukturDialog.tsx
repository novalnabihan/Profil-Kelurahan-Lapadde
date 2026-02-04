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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { Struktur, RoleCategory, OrgUnit } from '@/generated/prisma'

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
  const [roleCategory, setRoleCategory] = useState<RoleCategory | ''>('')
  const [unit, setUnit] = useState<OrgUnit | ''>('')
  const [order, setOrder] = useState(0)
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    if (!open) return

    if (editData) {
      setName(editData.name)
      setPosition(editData.position)
      setRoleCategory(editData.roleCategory ?? '')
      setUnit(editData.unit ?? '')
      setOrder(editData.order)
      setPhotoUrl(editData.photoUrl || '')
    } else {
      setName('')
      setPosition('')
      setRoleCategory('')
      setUnit('')
      setOrder(0)
      setPhotoUrl('')
    }
  }, [open, editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(
        editData ? `/api/struktur/${editData.id}` : '/api/struktur',
        {
          method: editData ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            position,
            roleCategory: roleCategory || null,
            unit: unit || null,
            order,
            photoUrl: photoUrl || null,
          }),
        }
      )

      if (!res.ok) throw new Error('Save failed')

      onSuccess()
    } catch (err) {
      console.error(err)
      alert('Gagal menyimpan data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Anggota Struktur' : 'Tambah Anggota Struktur'}
          </DialogTitle>
          <DialogDescription>
            Tentukan posisi, kategori jabatan, dan unit kerja.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label>Nama Lengkap</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Jabatan */}
          <div className="space-y-2">
            <Label>Jabatan</Label>
            <Input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            />
          </div>

          {/* Role Category */}
          <div className="space-y-2">
            <Label>Kategori Jabatan</Label>
            <Select
              value={roleCategory}
              onValueChange={(v) => setRoleCategory(v as RoleCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RoleCategory).map((v) => (
                  <SelectItem key={v} value={v}>
                    {v.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label>Unit Kerja</Label>
            <Select
              value={unit}
              onValueChange={(v) => setUnit(v as OrgUnit)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrgUnit).map((v) => (
                  <SelectItem key={v} value={v}>
                    {v.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label>Urutan</Label>
            <Input
              type="number"
              min={0}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              required
            />
            <p className="text-xs text-[#718096]">
              Angka kecil tampil lebih atas
            </p>
          </div>

          {/* Foto */}
          <ImageUpload
            value={photoUrl}
            onChange={setPhotoUrl}
            folder="struktur"
            label="Foto"
          />

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
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
