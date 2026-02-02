// src/hooks/useAdminSessionTimeout.ts
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Durasi idle default: 30 menit
const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000;
// Key untuk localStorage
const LAST_ACTIVITY_KEY = 'admin_last_activity';

export function useAdminSessionTimeout(timeoutMs: number = DEFAULT_TIMEOUT_MS) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🔐 Ganti logic logout sesuai stack kamu
  const logout = async () => {
    try {
      // Kalau kamu pakai Supabase client di FE:
      // const supabase = createSupabaseBrowserClient();
      // await supabase.auth.signOut();

      // Atau kalau ada API logout sendiri:
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

      // Reset last activity
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LAST_ACTIVITY_KEY);
      }
    } finally {
      router.push('/admin/login?reason=session_expired');
    }
  };

  const setLastActivity = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
  };

  const checkInitialTimeout = () => {
    if (typeof window === 'undefined') return;

    const raw = localStorage.getItem(LAST_ACTIVITY_KEY);
    if (!raw) {
      setLastActivity();
      return;
    }

    const last = Number(raw);
    const now = Date.now();

    if (!Number.isNaN(last) && now - last > timeoutMs) {
      // Udah kelewat lama → langsung logout
      logout();
    } else {
      // Masih ok → perbarui timestamp
      setLastActivity();
    }
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLastActivity();

    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMs);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Cek kondisi awal (buat kasus buka tab lagi setelah lama)
    checkInitialTimeout();
    // Set timer pertama
    resetTimer();

    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ];

    const activityHandler = () => {
      resetTimer();
    };

    events.forEach((ev) => window.addEventListener(ev, activityHandler));

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((ev) =>
        window.removeEventListener(ev, activityHandler),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutMs]);
}
