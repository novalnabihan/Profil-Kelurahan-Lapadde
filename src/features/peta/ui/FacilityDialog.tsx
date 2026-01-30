//src/features/peta/ui/FacilityDialog.tsx

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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { Facility } from '@/generated/prisma'
import { FacilityCategory } from '../types'
import { FACILITY_ICONS, FACILITY_LABELS } from '../utils/facility-icons'

interface FacilityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editData?: Facility | null
  onSuccess: () => void
}

const categories: FacilityCategory[] = [
  'kantor',
  'sekolah',
  'masjid',
  'puskesmas',
  'taman',
  'lapangan',
  'pasar',
  'posyandu',
  'bank',
]

export default function FacilityDialog({
  open,
  onOpenChange,
  editData,
  onSuccess,
}: FacilityDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<string>('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (open) {
      if (editData) {
        setName(editData.name)
        setCategory(editData.category)
        setAddress(editData.address || '')
        setLatitude(editData.latitude.toString())
        setLongitude(editData.longitude.toString())
        setDescription(editData.description || '')
      } else {
        setName('')
        setCategory('')
        setAddress('')
        setLatitude('')
        setLongitude('')
        setDescription('')
      }
    }
  }, [open, editData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editData
        ? `/api/facilities/${editData.id}`
        : '/api/facilities'

      const method = editData ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          address: address || null,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          description: description || null,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}
          </DialogTitle>
          <DialogDescription>
            Tambahkan lokasi sarana dan prasarana di wilayah kelurahan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="name">Nama Fasilitas</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: SDN 01 Lapadde"
              required
            />
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <div className="flex items-center gap-2">
                      <span>{FACILITY_ICONS[cat]}</span>
                      <span>{FACILITY_LABELS[cat]}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Alamat */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Pendidikan No. 12"
            />
          </div>

          {/* Koordinat */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Contoh: 1.1195"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Contoh: 104.0457"
                required
              />
            </div>
          </div>
          <p className="text-xs text-[#718096]">
            💡 Tip: Buka Google Maps → Klik kanan lokasi → Copy koordinat
          </p>

          {/* Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Informasi tambahan tentang fasilitas ini"
              rows={3}
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