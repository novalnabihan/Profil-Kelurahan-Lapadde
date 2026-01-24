// src/features/rt-rw/ui/DirectionButton.tsx

'use client';

interface DirectionButtonProps {
  lat: number;
  lng: number;
  size?: 'default' | 'small';
}

export default function DirectionButton({ lat, lng, size = 'default' }: DirectionButtonProps) {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={openGoogleMaps}
      className={`w-full flex items-center justify-center gap-2 bg-[#8b9474] text-white rounded-md font-medium hover:bg-[#6d7558] transition-colors ${
        size === 'small' ? 'px-3 py-2 text-[13px]' : 'px-4 py-2.5 text-[14px]'
      }`}
    >
      <span>🗺️</span>
      <span>Petunjuk Arah</span>
    </button>
  );
}