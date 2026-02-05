// src/features/site/ui/HeroSection.tsx
import { Users, MapPin, Building2, UserCog } from 'lucide-react'

export interface HeroStats {
  rwCount: number
  rtCount: number
  facilityCount: number
  staffCount: number
}

interface HeroSectionProps {
  stats?: HeroStats
}

export default function HeroSection({ stats }: HeroSectionProps) {
  // Fallback kalau belum ada data di DB / query gagal dipass
  const defaultStats: HeroStats = {
    rwCount: 10,
    rtCount: 45,
    facilityCount: 18,
    staffCount: 14,
  }

  const displayStats = stats ?? defaultStats

  return (
    <section
      id="beranda"
      className="relative overflow-hidden bg-[#8b9474]"
    >
      {/* Decorative elements - lebih subtle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative max-w-[1140px] mx-auto px-6 py-14 sm:py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          {/* Text */}
          <div className="text-white">            
            <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-tight mb-5">
              Informasi Wilayah Kelurahan Lapadde
            </h1>

            <p className="text-[18px] sm:text-[18px] leading-relaxed text-white/95 max-w-[540px]">
              Menyediakan data dan informasi seputar wilayah, kependudukan,
              struktur organisasi, serta layanan kelurahan yang dapat diakses
              oleh masyarakat secara terbuka.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <StatBox
              number={displayStats.rwCount}
              label="RW"
              icon={<MapPin className="w-5 h-5 sm:w-5 sm:h-5" />}
            />
            <StatBox
              number={displayStats.rtCount}
              label="RT"
              icon={<Users className="w-5 h-5 sm:w-5 sm:h-5" />}
            />
            <StatBox
              number={displayStats.facilityCount}
              label="Fasilitas Umum"
              icon={<Building2 className="w-5 h-5 sm:w-5 sm:h-5" />}
            />
            <StatBox
              number={displayStats.staffCount}
              label="Perangkat Kelurahan"
              icon={<UserCog className="w-5 h-5 sm:w-5 sm:h-5" />}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatBox({
  number,
  label,
  icon,
}: {
  number: number
  label: string
  icon: React.ReactNode
}) {
  return (
    <div 
      className="group relative rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-4 py-4 
        hover:bg-white/30 hover:border-white/40 hover:shadow-xl hover:shadow-black/5
        transition-all duration-300 hover:-translate-y-1 cursor-default"
    >
      <div className="flex items-center gap-3">
        {/* Icon di kiri dengan background circle */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 
          flex items-center justify-center
          group-hover:bg-white/30 group-hover:scale-105 transition-all duration-300">
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <div className="text-[26px] sm:text-[28px] font-bold text-white leading-none
            group-hover:scale-105 transition-transform duration-300 origin-left">
            {number.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] sm:text-[12px] text-white/90 font-medium mt-0.5 leading-tight">
            {label}
          </div>
        </div>
      </div>
    </div>
  )
}