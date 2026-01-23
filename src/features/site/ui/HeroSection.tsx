interface HeroStats {
  rtRwCount: number;
  population: number;
  familyCount: number;
  area: string;
}

interface HeroSectionProps {
  stats?: HeroStats;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const defaultStats = {
    rtRwCount: 12,
    population: 4823,
    familyCount: 1245,
    area: '3.2 km²',
  };

  const displayStats = stats || defaultStats;

  return (
    <section className="bg-[#8b9474] relative overflow-hidden" id="beranda">
      <div className="max-w-[1140px] mx-auto px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-12">
          <div className="text-white">
            <h2 className="text-[29px] md:text-[34px] font-semibold leading-tight mb-3.5">
              Melayani dengan Sepenuh Hati
            </h2>
            <p className="text-[16px] md:text-[17px] leading-relaxed opacity-92 max-w-[520px]">
              Memberikan pelayanan terbaik untuk masyarakat dengan cepat, mudah, dan transparan. 
              Kami berkomitmen untuk terus meningkatkan kualitas layanan publik.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatBox number={displayStats.rtRwCount.toString()} label="RT/RW" />
            <StatBox number={displayStats.population.toLocaleString('id-ID')} label="Penduduk" />
            <StatBox number={displayStats.familyCount.toLocaleString('id-ID')} label="Kepala Keluarga" />
            <StatBox number={displayStats.area} label="Luas Wilayah" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm p-[18px] rounded-md border border-white/20">
      <span className="block text-[24px] font-semibold text-white mb-1">{number}</span>
      <span className="block text-[13px] text-white/85">{label}</span>
    </div>
  );
}