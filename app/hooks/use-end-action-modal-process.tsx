'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function useEndActionModalProcess({
  signal,
}: {
  signal?: boolean;
}) {
  const { back } = useRouter();
  useEffect(() => {
    if (signal) {
      back();
    }
  }, [signal]);
  return null;
}
