'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, MouseEvent } from 'react';
import { ShieldCheck } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
  type: 'anchor' | 'page';
  anchorId?: string; // hanya untuk anchor
};

export default function MainNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentAnchor, setCurrentAnchor] = useState<string>('');

  // Shadow kecil saat discroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sinkron currentAnchor saat berpindah ke /
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (pathname !== '/') {
      // lagi di halaman lain → anchor tidak aktif
      setCurrentAnchor('');
      return;
    }

    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setCurrentAnchor(hash);
    } else {
      setCurrentAnchor('beranda');
    }
  }, [pathname]);

  const navLinks: NavLink[] = [
    { href: '/#beranda', label: 'Beranda', type: 'anchor', anchorId: 'beranda' },
    { href: '/#visi-misi', label: 'Visi & Misi', type: 'anchor', anchorId: 'visi-misi' },
    { href: '/#struktur', label: 'Struktur', type: 'anchor', anchorId: 'struktur' },
    { href: '/#peta', label: 'Peta', type: 'anchor', anchorId: 'peta' },    
    { href: '/#denah-kantor', label: 'Denah', type: 'anchor', anchorId: 'denah' },
    { href: '/#alur-pengaduan', label: 'Alur Pengaduan', type: 'anchor', anchorId: 'alur-pengaduan' },
    { href: '/rt-rw', label: 'RT/RW', type: 'page' },
  ];

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.type !== 'anchor') return;
    if (pathname !== '/') return; // lagi di /rt-rw misalnya → biar Next handle sendiri

    e.preventDefault();

    const id = link.anchorId!;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // update URL tanpa reload
    window.history.pushState(null, '', `/#${id}`);
    setCurrentAnchor(id);
  };

  const isActive = (link: NavLink) => {
    if (link.type === 'anchor') {
      if (pathname !== '/') return false;
      if (!currentAnchor && link.anchorId === 'beranda') return true;
      return currentAnchor === link.anchorId;
    }
    return pathname.startsWith(link.href);
  };

  return (
    <header
      className={`sticky top-0 z-[2000] bg-white ${
        isScrolled ? 'shadow-sm' : 'shadow-none'
      } transition-shadow`}
    >
      {/* Top bar hijau */}
      {/* <div className="bg-[#8b9474] py-2">
        <div className="max-w-[1140px] mx-auto px-6">
          <p className="text-white text-[13px]">
            Selamat datang di website resmi Kelurahan Lapadde
          </p>
        </div>
      </div> */}

      {/* Brand row */}
      <div className="max-w-[1140px] mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#8b9474] rounded flex-shrink-0" />
          <div>
            <h1 className="text-[18px] font-semibold text-[#1a202c] leading-tight">
              Website Profil Kelurahan Lapadde
            </h1>
            <p className="text-[13px] text-[#718096] mt-0.5">
              Kecamatan Batam Kota
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
<nav className="border-t border-[#e8ecf1]">
  <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between">
    
    {/* LEFT: NAV LINKS */}
    <ul className="flex overflow-x-auto">
      {navLinks.map((link) => {
        const active = isActive(link);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={(e) => handleAnchorClick(e, link)}
              className={`block px-[18px] py-[14px] text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? 'text-[#8b9474] border-[#8b9474]'
                  : link.type === 'page'
                  ? 'text-[#718096] border-transparent hover:text-[#8b9474] hover:border-[#d4d9c6]'
                  : 'text-[#4a5568] border-transparent hover:text-[#8b9474] hover:border-[#d4d9c6]'
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>

    {/* RIGHT: ADMIN LOGIN */}
    <Link
      href="/admin/login"
      className="
        ml-4
        flex items-center gap-2
        text-[13px] font-medium
        text-[#4a5568]
        hover:text-[#8b9474]
        transition-colors
        px-3 py-2
        rounded
        hover:bg-[#f8f9fa]
      "
    >
      <ShieldCheck size={16} />
      <span className="hidden sm:inline">Admin</span>
    </Link>

  </div>
</nav>

    </header>
  );
}
