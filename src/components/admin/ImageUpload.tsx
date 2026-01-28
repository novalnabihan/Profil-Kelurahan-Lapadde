'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file maksimal 8MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      // Pass old URL to be deleted
      if (value) {
        formData.append('oldUrl', value)
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gagal mengupload gambar')
    } finally {
      setUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    if (!confirm('Hapus gambar ini?')) return

    try {
      // Call delete API
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: value }),
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      onChange('')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Gagal menghapus gambar')
    }
  }

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}

      {/* Preview */}
      {value ? (
        <div className="relative w-full max-w-md">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#e2e8f0]">
            <Image
              src={value}
              alt={label || 'Upload'}
              fill
              className="object-contain"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#e2e8f0] rounded-lg p-12 hover:border-[#8b9474] transition-colors">
            <ImageIcon className="h-12 w-12 text-[#cbd5e0] mb-4" />
            <p className="text-sm text-[#718096] mb-4">Belum ada gambar</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih Gambar
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Helper Text */}
      <p className="text-xs text-[#718096]">
        Format: JPG, PNG, atau WEBP. Maksimal 8MB.
      </p>
    </div>
  )
}