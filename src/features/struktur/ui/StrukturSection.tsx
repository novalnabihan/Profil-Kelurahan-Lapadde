import Image from 'next/image';

interface StrukturMember {
  id: string;
  name: string;
  position: string;
  photoUrl?: string;
  order: number;
}

interface StrukturSectionProps {
  members: StrukturMember[];
}

export default function StrukturSection({ members }: StrukturSectionProps) {
  const lurah = members.find(m => m.order === 0);
  const staff = members.filter(m => m.order > 0).sort((a, b) => a.order - b.order);

  return (
    <section className="py-14 bg-[#f8f9fa]" id="struktur">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#1a202c] mb-8">Struktur Organisasi</h2>
        
        {lurah && (
          <div className="bg-white p-8 rounded-md mb-6 text-center border-t-4 border-[#8b9474]">
            <div className="text-[12px] text-[#8b9474] uppercase tracking-wider font-semibold mb-2">
              {lurah.position}
            </div>
            <div className="text-[19px] font-semibold text-[#1a202c]">
              {lurah.name}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-3.5">
          {staff.map((member) => (
            <div
              key={member.id}
              className="bg-white p-5 rounded-md flex justify-between items-center"
            >
              <div>
                <div className="text-[13px] text-[#718096] font-medium mb-0.5">
                  {member.position}
                </div>
                <div className="text-[15px] font-semibold text-[#1a202c]">
                  {member.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}