// src/features/rt-rw/utils/phone.ts

// Normalisasi nomor ke format WA: 08xxxxx -> 62xxxxxxxxx
export function normalizePhoneToWa(phone?: string | null): string | null {
  if (!phone) return null;

  // ambil hanya digit
  const digits = phone.replace(/\D/g, '');

  if (!digits) return null;

  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }

  if (digits.startsWith('62')) {
    return digits;
  }

  return digits;
}

export function buildWaUrl(phone?: string | null): string | null {
  const normalized = normalizePhoneToWa(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}`;
}

// Dipakai di komponen client (onClick)
export function openWhatsApp(phone?: string | null) {
  if (typeof window === 'undefined') return;
  const url = buildWaUrl(phone);
  if (!url) return;
  window.open(url, '_blank');
}
