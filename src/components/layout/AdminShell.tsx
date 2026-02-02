// src/components/layout/AdminShell.tsx
'use client';

import { ReactNode } from 'react';
import { useAdminSessionTimeout } from '@/hooks/useAdminSessionTimeout';

type Props = {
  children: ReactNode;
};

export default function AdminShell({ children }: Props) {
  // Misal timeout 45 menit (bisa kamu ganti)
  useAdminSessionTimeout(45 * 60 * 1000);

  return <>{children}</>;
}
