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
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'
import { RtRwData } from '../types'

interface RtRwDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: 'RW' | 'RT'
  editData?: RtRwData | null
  rwParentId?: string | null
  onSuccess: () => void
}

export default function RtRwDialog({
  open,
  onOpenChange,
  type,
  editData,
  rwParentId,
  onSuccess,
}: RtRwDialogProps) {
  const [loading, setLoading] = useState(false)
  const [number, setNumber] = useState('')
  const [leader, setLeader] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [order, setOrder] = useState(0)

  useEffect(() => {
    if (open) {
      if (editData) {
        setNumber(editData.number)
        setLeader(editData.leader)
        setPhone(editData.phone || '')
        setAddress(editData.address || '')
        setLatitude(editData.latitude?.toString() || '')
        setLongitude(editData.longitude?.toString() || '')
        setPhotoUrl(editData.photoUrl || '')
        setOrder(editData.order)
      } else {
        setNumber('')
        setLeader('')
        setPhone('')
        setAddress('')
        setLatitude('')
        setLongitude('')
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
        ? `/api/rt-rw/${editData.id}`
        : '/api/rt-rw'

      const method = editData ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          number,
          leader,
          phone: phone || null,
          address: address || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          photoUrl: photoUrl || null,
          order: Number(order),
          rwParentId: type === 'RT' ? rwParentId : null,
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
            {editData ? `Edit ${type}` : `Tambah ${type} Baru`}
          </DialogTitle>
          <DialogDescription>
            {type === 'RW' 
              ? 'Tambahkan informasi ketua RW'
              : 'Tambahkan informasi ketua RT'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Nomor */}
            <div className="space-y-2">
              <Label htmlFor="number">Nomor {type}</Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Contoh: 01"
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
            </div>
          </div>

          {/* Nama Ketua */}
          <div className="space-y-2">
            <Label htmlFor="leader">Nama Ketua {type}</Label>
            <Input
              id="leader"
              value={leader}
              onChange={(e) => setLeader(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon/WhatsApp</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Contoh: 08123456789"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Merdeka No. 10"
              rows={3}
            />
          </div>

          {/* Coordinates */}
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
              />
            </div>
          </div>
          <p className="text-xs text-[#718096]">
            💡 Tip: Buka Google Maps → Klik kanan lokasi → Copy koordinat
          </p>

          {/* Photo */}
          <div className="space-y-2">
            <ImageUpload
              value={photoUrl}
              onChange={setPhotoUrl}
              folder="rtrw"
              label="Foto Ketua"
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