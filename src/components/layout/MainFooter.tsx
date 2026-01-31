// src/components/layout/MainFooter.tsx
"use client";

import Link from "next/link";

const contacts = [
  {
    icon: "📍",
    title: "Alamat Kantor",
    content: "Jl. Raya Kelurahan No. 45\nBatam Kota, Batam 29432",
  },
  {
    icon: "📞",
    title: "Telepon",
    content: "(0778) 123456\n08123456789 (WhatsApp)",
  },
  {
    icon: "📧",
    title: "Email",
    content: "kelurahan.lapadde@batam.go.id",
  },
  {
    icon: "🕒",
    title: "Jam Layanan",
    content: "Senin - Jumat: 08.00 - 16.00\nSabtu: 08.00 - 12.00",
  },
];

const navLinks = [
  { href: "/#beranda", label: "Beranda" },
  { href: "/#visi-misi", label: "Visi & Misi" },
  { href: "/#struktur", label: "Struktur" },
  { href: "/#peta", label: "Peta" },
  { href: "/rt-rw", label: "RT/RW" },
  { href: "/tentang", label: "Tentang" },
];

export default function MainFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1f2933] text-white mt-16">
      {/* Top content */}
      <div className="max-w-[1140px] mx-auto px-6 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_1.4fr] items-start">
          {/* Brand / intro */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded bg-[#8b9474] flex items-center justify-center">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <p className="text-[14px] uppercase tracking-[0.12em] text-white/60 mb-0.5">
                  Website Resmi
                </p>
                <h3 className="text-[18px] font-semibold leading-snug">
                  Kelurahan Lapadde
                </h3>
              </div>
            </div>
            <p className="text-[14px] text-white/75 leading-relaxed max-w-md">
              Portal informasi pelayanan publik, profil wilayah, dan kegiatan
              warga Kelurahan Lapadde. Dibangun untuk memudahkan warga mengakses
              informasi secara cepat dan transparan.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[15px] font-semibold mb-3 text-white">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/75 hover:text-[#d4d9c6] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {/* <div>
            <h4 className="text-[15px] font-semibold mb-3 text-white">
              Kontak & Layanan
            </h4>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {contacts.map((contact) => (
                <div
                  key={contact.title}
                  className="bg-white/5 border border-white/10 rounded-md p-4 flex gap-3"
                >
                  <div className="w-9 h-9 rounded bg-[#8b9474] flex items-center justify-center text-[18px] flex-shrink-0">
                    {contact.icon}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white mb-1">
                      {contact.title}
                    </p>
                    <p className="text-[13px] text-white/75 leading-relaxed whitespace-pre-line break-words">
                      {contact.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1140px] mx-auto px-6 py-4 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
          <p className="text-[12px] text-white/65 text-center md:text-left">
            &copy; {year} Kelurahan Lapadde. Semua hak dilindungi.
          </p>
          <p className="text-[12px] text-white/50 text-center md:text-right">
            Dibangun oleh mahasiswa KKN-T Universitas Hasanuddin sebagai bagian
            dari program digitalisasi pelayanan kelurahan.
          </p>
        </div>
      </div>
    </footer>
  );
}
