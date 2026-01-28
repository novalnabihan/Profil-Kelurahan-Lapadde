'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Save, CheckCircle2 } from 'lucide-react'
import { SiteProfile } from '@/generated/prisma'
import ImageUpload from '@/components/admin/ImageUpload'

interface ProfilFormProps {
  profile: SiteProfile
}

export default function ProfilForm({ profile }: ProfilFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('tentang')

  // Form state
  const [about, setAbout] = useState(profile.about || '')
  const [vision, setVision] = useState(profile.vision || '')
  const [mission, setMission] = useState(profile.mission || '')
  const [officeMap, setOfficeMap] = useState(profile.officeMap || '')
  const [complaintFlow, setComplaintFlow] = useState(profile.complaintFlow || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about,
          vision,
          mission,
          officeMap,
          complaintFlow,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSuccess(true)
      router.refresh()

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Gagal menyimpan perubahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="tentang" className="text-sm">
            Tentang
          </TabsTrigger>
          <TabsTrigger value="visi-misi" className="text-sm">
            Visi & Misi
          </TabsTrigger>
          <TabsTrigger value="denah" className="text-sm">
            Denah Kantor
          </TabsTrigger>
          <TabsTrigger value="alur" className="text-sm">
            Alur Pengaduan
          </TabsTrigger>
        </TabsList>

        {/* Tab: Tentang */}
        <TabsContent value="tentang">
          <Card>
            <CardHeader>
              <CardTitle>Tentang Kelurahan</CardTitle>
              <CardDescription>
                Informasi umum tentang kelurahan (sejarah, profil, dll)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about">Konten Tentang</Label>
                <Textarea
                  id="about"
                  placeholder="Tulis informasi tentang kelurahan..."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={12}
                  className="resize-none"
                />
                <p className="text-xs text-[#718096]">
                  Tulis dengan format paragraf. Tekan Enter untuk baris baru.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Visi & Misi */}
        <TabsContent value="visi-misi">
          <Card>
            <CardHeader>
              <CardTitle>Visi & Misi Kelurahan</CardTitle>
              <CardDescription>
                Visi dan misi yang ditampilkan di halaman utama
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visi */}
              <div className="space-y-2">
                <Label htmlFor="vision">Visi</Label>
                <Textarea
                  id="vision"
                  placeholder="Contoh: Terwujudnya Kelurahan yang Sejahtera..."
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Misi */}
              <div className="space-y-2">
                <Label htmlFor="mission">Misi</Label>
                <Textarea
                  id="mission"
                  placeholder="Tulis misi, satu baris per poin. Contoh:
Meningkatkan kualitas pelayanan publik
Memberdayakan ekonomi masyarakat
Menjaga keamanan lingkungan"
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={10}
                  className="resize-none"
                />
                <p className="text-xs text-[#718096]">
                  Tulis satu misi per baris (tekan Enter untuk poin baru)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Denah Kantor */}
        <TabsContent value="denah">
          <Card>
            <CardHeader>
              <CardTitle>Denah Kantor</CardTitle>
              <CardDescription>
                Upload gambar denah/layout kantor kelurahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={officeMap}
                onChange={setOfficeMap}
                folder="profile"
                label="Denah Kantor"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Alur Pengaduan */}
        <TabsContent value="alur">
          <Card>
            <CardHeader>
              <CardTitle>Alur Pengaduan</CardTitle>
              <CardDescription>
                Upload gambar flowchart alur pengaduan warga
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={complaintFlow}
                onChange={setComplaintFlow}
                folder="profile"
                label="Alur Pengaduan"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 pt-6">
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
            <>
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </>
          )}
        </Button>

        {success && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Perubahan berhasil disimpan!</span>
          </div>
        )}
      </div>
    </form>
  )
}