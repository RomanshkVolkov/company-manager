'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function useEndActionReload({ signal }: { signal: boolean }) {
  const { refresh, push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (signal) {
      // all this try is trash
    }
  }, [pathname, push, refresh, searchParams, signal]);

  return null;
}
