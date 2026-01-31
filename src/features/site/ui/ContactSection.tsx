// src/features/site/ui/contactsection

const contacts = [
  {
    icon: '📍',
    title: 'Alamat Kantor',
    content: 'Jl. Raya Kelurahan No. 45\nBatam Kota, Batam 29432',
  },
  {
    icon: '📞',
    title: 'Telepon',
    content: '(0778) 123456\n08123456789 (WhatsApp)',
  },
  {
    icon: '📧',
    title: 'Email',
    content: 'kelurahan.lapadde@batam.go.id',
  },
  {
    icon: '🕒',
    title: 'Jam Layanan',
    content: 'Senin - Jumat: 08.00 - 16.00\nSabtu: 08.00 - 12.00',
  },
];

export default function ContactSection() {
  return (
    <section className="py-14 bg-[#f8f9fa]">
      <div className="max-w-[1140px] mx-auto px-6">
        <h2 className="text-[22px] font-semibold text-[#1a202c] mb-8">Hubungi Kami</h2>
        
        <div className="grid md:grid-cols-2 gap-3.5">
          {contacts.map((contact) => (
            <div key={contact.title} className="bg-white p-5 rounded-md flex gap-4">
              <div className="w-11 h-11 bg-[#8b9474] rounded flex items-center justify-center text-[20px] flex-shrink-0">
                {contact.icon}
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-[#1a202c] mb-1">
                  {contact.title}
                </h4>
                <p className="text-[14px] text-[#4a5568] leading-relaxed whitespace-pre-line">
                  {contact.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}