'use client';

// framework
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// libs
// types and utils
// components

export default function usePrefetch(links: string[]) {
  const { prefetch } = useRouter();

  const runPrefetchLinks = () =>
    links.forEach((link) => {
      prefetch(link);
    });

  useEffect(runPrefetchLinks, []);

  return null;
}
