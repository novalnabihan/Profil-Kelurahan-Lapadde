interface VisionMissionProps {
  vision?: string;
  mission?: string;
}

export default function VisionMissionSection({ vision, mission }: VisionMissionProps) {
  const defaultVision = "Terwujudnya Kelurahan Lapadde yang Sejahtera, Aman, Nyaman, dan Berbudaya";
  const defaultMission = [
    'Meningkatkan kualitas pelayanan publik kepada masyarakat',
    'Memberdayakan ekonomi masyarakat melalui UMKM',
    'Menjaga keamanan dan ketertiban lingkungan',
    'Meningkatkan partisipasi masyarakat dalam pembangunan',
    'Melestarikan nilai-nilai budaya lokal',
  ];

  const displayVision = vision || defaultVision;
  const displayMission = mission ? mission.split('\n').filter(Boolean) : defaultMission;

  return (
    <section className="py-14 bg-white" id="visi-misi">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#1a202c] mb-8">Visi & Misi Kelurahan</h2>
        
        <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="bg-[#f8f9fa] p-7 rounded-md">
            <h3 className="text-[15px] font-semibold text-[#8b9474] uppercase tracking-wide mb-3">
              Visi
            </h3>
            <p className="text-[17px] text-[#2d3748] leading-relaxed italic">
              "{displayVision}"
            </p>
          </div>

          <div className="bg-[#f8f9fa] p-7 rounded-md">
            <h3 className="text-[15px] font-semibold text-[#8b9474] uppercase tracking-wide mb-3">
              Misi
            </h3>
            <ul className="space-y-2.5">
              {displayMission.map((item, index) => (
                <li key={index} className="text-[15px] text-[#4a5568] leading-relaxed pl-6 relative">
                  <span className="absolute left-0 text-[#8b9474] font-semibold">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}