'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MainNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

 const navLinks = [
  { href: '/#beranda', label: 'Beranda', type: 'anchor' },
  { href: '/#visi-misi', label: 'Visi & Misi', type: 'anchor' },
  { href: '/#struktur', label: 'Struktur', type: 'anchor' },
  { href: '/#peta', label: 'Peta', type: 'anchor' },
  { href: '/rt-rw', label: 'RT/RW', type: 'page' },
  { href: '/tentang', label: 'Tentang', type: 'page' },  // ← Tambah ini
];

  const isActive = (href: string) => {
    if (href.startsWith('/#')) {
      return pathname === '/' && typeof window !== 'undefined' && window.location.hash === href.substring(1);
    }
    return pathname.startsWith(href);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="bg-[#8b9474] py-2">
        <div className="max-w-[1140px] mx-auto px-6">
          <p className="text-white text-[13px]">Selamat datang di website resmi Kelurahan Lapadde</p>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#8b9474] rounded flex-shrink-0" />
          <div>
            <h1 className="text-[18px] font-semibold text-[#1a202c] leading-tight">
              Kelurahan Lapadde
            </h1>
            <p className="text-[13px] text-[#718096] mt-0.5">Kecamatan Batam Kota</p>
          </div>
        </div>
      </div>

      <nav className="border-t border-[#e8ecf1] overflow-x-auto">
        <ul className="flex max-w-[1140px] mx-auto px-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-[18px] py-[14px] text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive(link.href)
                    ? 'text-[#8b9474] border-[#8b9474]'
                    : link.type === 'page'
                    ? 'text-[#718096] border-transparent hover:text-[#8b9474] hover:border-[#d4d9c6]'
                    : 'text-[#4a5568] border-transparent hover:text-[#8b9474] hover:border-[#d4d9c6]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}